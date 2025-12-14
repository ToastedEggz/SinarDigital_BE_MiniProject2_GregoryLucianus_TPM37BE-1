const prisma = require("../utils/prismaClient");
const fs = require("fs");
const path = require("path");

// CREATE Bookmark (with image)
exports.createBookmark = async (req, res) => {
  try {
    const { title, color, pageNumber, notes, categoryId } = req.body;

    if (!title || !color || pageNumber === undefined || !categoryId) {
      return res.status(400).json({
        message: "title, color, pageNumber, and categoryId are required",
      });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        color,
        pageNumber: Number(pageNumber),
        notes,
        categoryId: Number(categoryId),
        image: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ all Bookmarks (include Category)
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ Bookmark by ID
exports.getBookmarkById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await prisma.bookmark.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE Bookmark (replace image if provided)
exports.updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color, pageNumber, notes, categoryId } = req.body;

    const existing = await prisma.bookmark.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // delete old image if replaced
    if (req.file && existing.image) {
      fs.unlink(path.join(__dirname, "../../", existing.image), () => {});
    }

    const bookmark = await prisma.bookmark.update({
      where: { id: Number(id) },
      data: {
        title,
        color,
        pageNumber: Number(pageNumber),
        notes,
        categoryId: Number(categoryId),
        image: req.file ? `/uploads/${req.file.filename}` : existing.image,
      },
    });

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE Bookmark (remove image file)
exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await prisma.bookmark.findUnique({
      where: { id: Number(id) },
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    if (bookmark.image) {
      fs.unlink(path.join(__dirname, "../../", bookmark.image), () => {});
    }

    await prisma.bookmark.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
