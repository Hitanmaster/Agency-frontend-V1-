import { MongoClient, ObjectId } from "mongodb";
import { MongoAgency, mongoAgencySchema } from "@shared/schema";

export interface AgencyQueryParams {
  page: number;
  limit: number;
  tag?: string;
  search?: string;
  random?: boolean;
}

export interface IStorage {
  getAgencies(params: AgencyQueryParams): Promise<{ agencies: MongoAgency[], totalCount: number }>;
  getAgencyById(id: string): Promise<MongoAgency | null>;
  getTags(): Promise<string[]>;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private dbName = "agency_database"; // replace with your actual database name
  private collectionName = "agencies"; // replace with your actual collection name
  
  constructor(uri: string) {
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async getAgencies({ page, limit, tag, search, random = false }: AgencyQueryParams): Promise<{ agencies: MongoAgency[], totalCount: number }> {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const query: any = {};
    
    if (tag) {
      // Match tag in either tags array or categories array
      query.$or = [
        { tags: tag },
        { categories: tag }
      ];
    }
    
    if (search) {
      // Handle both schemas when searching
      query.$or = [
        { agency_name: { $regex: search, $options: "i" } },
        { project_title: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);
    
    // Create pipeline for aggregation
    const pipeline: any[] = [
      { $match: query }
    ];
    
    // Add sorting logic
    if (random) {
      // Add a random sort using the $sample stage for true randomness
      pipeline.push({ $sample: { size: totalCount } });
    } else {
      // Default sort by scraped_date when available, otherwise by _id
      pipeline.push({ 
        $sort: { 
          scraped_date: -1,
          _id: -1 // Fallback sort to ensure consistent ordering
        } 
      });
    }
    
    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    
    // Execute the aggregation pipeline
    const agencies = await collection.aggregate(pipeline).toArray();
    
    // Transform MongoDB documents to match our schema
    const validatedAgencies = agencies.map(agency => {
      const transformed = {
        ...agency,
        _id: agency._id.toString(), // Convert ObjectId to string
        
        // Map fields from second schema to first schema format for UI consistency
        agency_name: agency.agency_name || agency.title || "Unknown Agency",
        project_title: agency.project_title || agency.title || "Untitled Project",
        project_description: agency.project_description || agency.description || "",
        project_url: agency.project_url || agency.project_page_url || "",
        
        // Handle project images from both schemas
        project_images: agency.project_images || 
          (agency.media_url ? [agency.media_url] : []),
        
        // Ensure tags is always available as an array
        tags: agency.tags || 
          (agency.categories ? Array.isArray(agency.categories) ? agency.categories : [] : [])
      };
      
      // Attempt to validate with our schema
      try {
        return mongoAgencySchema.parse(transformed);
      } catch (error) {
        console.error("Schema validation error:", error);
        // Return a partially valid object for resilience
        return transformed as MongoAgency;
      }
    });
    
    return { agencies: validatedAgencies, totalCount };
  }

  async getAgencyById(id: string): Promise<MongoAgency | null> {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      
      const agency = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!agency) {
        return null;
      }
      
      // Transform document to match our expected schema
      const transformed = {
        ...agency,
        _id: agency._id.toString(), // Convert ObjectId to string
        
        // Map fields from second schema to first schema format for UI consistency
        agency_name: agency.agency_name || agency.title || "Unknown Agency",
        project_title: agency.project_title || agency.title || "Untitled Project",
        project_description: agency.project_description || agency.description || "",
        project_url: agency.project_url || agency.project_page_url || "",
        
        // Handle project images from both schemas
        project_images: agency.project_images || 
          (agency.media_url ? [agency.media_url] : []),
        
        // Ensure tags is always available as an array
        tags: agency.tags || 
          (agency.categories ? Array.isArray(agency.categories) ? agency.categories : [] : [])
      };
      
      return mongoAgencySchema.parse(transformed);
    } catch (error) {
      console.error("Error fetching agency by ID:", error);
      return null;
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const db = this.client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      
      // Gather tags from both schema formats
      const tagsArray = await collection.distinct("tags");
      const categoriesArray = await collection.distinct("categories");
      
      // Combine both arrays and remove duplicates
      const allTags = [...tagsArray, ...categoriesArray];
      
      // Filter out any null/undefined values and convert to strings
      const filteredTags = allTags.filter(tag => tag != null).map(tag => String(tag));
      
      // Remove duplicates using a Set and convert back to array
      return Array.from(new Set(filteredTags));
    } catch (error) {
      console.error("Error fetching tags:", error);
      return [];
    }
  }
}

// Use memory storage for development/testing when MongoDB is not available
export class MemStorage implements IStorage {
  private agencies: MongoAgency[] = [
    {
      _id: "68108bd8f16a6c7f7aa756c5",
      agency_name: "Koto Studio",
      project_title: "Amazon",
      project_description: "Brand redesign project",
      project_url: "https://koto.studio/work/amazon/",
      project_images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop"],
      tags: ["Branding"],
      scraped_date: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      _id: "68108bd8f16a6c7f7aa756c6",
      agency_name: "Pentagram",
      project_title: "Slack",
      project_description: "Visual identity project",
      project_url: "https://pentagram.com/work/slack",
      project_images: ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"],
      tags: ["Branding", "Digital"],
      scraped_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      last_updated: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  async getAgencies({ page, limit, tag, search, random = false }: AgencyQueryParams): Promise<{ agencies: MongoAgency[], totalCount: number }> {
    let filteredAgencies = [...this.agencies];
    
    // Apply tag filter
    if (tag) {
      filteredAgencies = filteredAgencies.filter(agency => 
        (agency.tags && agency.tags.includes(tag)) ||
        (agency.categories && Array.isArray(agency.categories) && agency.categories.includes(tag))
      );
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAgencies = filteredAgencies.filter(agency => {
        const agencyName = agency.agency_name || agency.title || "";
        const projectTitle = agency.project_title || agency.title || "";
        const description = agency.project_description || agency.description || "";
        
        return (
          agencyName.toLowerCase().includes(searchLower) || 
          projectTitle.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply sorting
    if (random) {
      // Shuffle array for random ordering
      for (let i = filteredAgencies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredAgencies[i], filteredAgencies[j]] = [filteredAgencies[j], filteredAgencies[i]];
      }
    } else {
      // Sort by scraped_date (newest first)
      filteredAgencies.sort((a, b) => {
        const dateA = a.scraped_date ? new Date(a.scraped_date).getTime() : 0;
        const dateB = b.scraped_date ? new Date(b.scraped_date).getTime() : 0;
        return dateB - dateA;
      });
    }
    
    const totalCount = filteredAgencies.length;
    const skip = (page - 1) * limit;
    const paginatedAgencies = filteredAgencies.slice(skip, skip + limit);
    
    return { agencies: paginatedAgencies, totalCount };
  }

  async getAgencyById(id: string): Promise<MongoAgency | null> {
    const agency = this.agencies.find(a => a._id === id);
    return agency || null;
  }

  async getTags(): Promise<string[]> {
    // Extract all tags from agencies and remove duplicates
    const allTags = this.agencies.flatMap(agency => agency.tags || []);
    return [...new Set(allTags)];
  }
}

// Determine which storage to use based on environment
const mongoUri = process.env.MONGODB_URI;
let storageInstance: IStorage;

if (mongoUri) {
  const mongoStorage = new MongoStorage(mongoUri);
  try {
    // Connect to MongoDB immediately
    mongoStorage.connect().catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      console.warn("Falling back to in-memory storage");
      storageInstance = new MemStorage();
    });
    storageInstance = mongoStorage;
  } catch (err) {
    console.error("Error initializing MongoDB storage:", err);
    console.warn("Falling back to in-memory storage");
    storageInstance = new MemStorage();
  }
} else {
  console.warn("MONGODB_URI not set, using in-memory storage");
  storageInstance = new MemStorage();
}

export const storage = storageInstance;
