import { NextResponse } from "next/server"
import ComplaintCategory from "@/models/complaint-category.model"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const active = searchParams.get("active")
    
    const query: any = {}
    if (active === "true") {
      query.isActive = true
    }
    
    const categories = await ComplaintCategory.find(query).sort({ priority: 1, name: 1 })
    
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.name || !data.description || !data.priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Check if category already exists
    const existingCategory = await ComplaintCategory.findOne({ name: data.name })
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }
    
    // Create new category
    const category = new ComplaintCategory({
      name: data.name,
      description: data.description,
      priority: data.priority,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })
    
    await category.save()
    
    return NextResponse.json({ 
      message: "Category created successfully",
      category 
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

