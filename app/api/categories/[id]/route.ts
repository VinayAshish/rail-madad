import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import ComplaintCategory from "@/models/complaint-category.model"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const category = await ComplaintCategory.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const category = await ComplaintCategory.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Update fields
    if (data.name !== undefined) category.name = data.name
    if (data.description !== undefined) category.description = data.description
    if (data.priority !== undefined) category.priority = data.priority
    if (data.isActive !== undefined) category.isActive = data.isActive

    await category.save()

    return NextResponse.json({
      message: "Category updated successfully",
      category,
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req)

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const category = await ComplaintCategory.findById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Instead of deleting, just mark as inactive
    category.isActive = false
    await category.save()

    return NextResponse.json({
      message: "Category deactivated successfully",
    })
  } catch (error) {
    console.error("Error deactivating category:", error)
    return NextResponse.json({ error: "Failed to deactivate category" }, { status: 500 })
  }
}

