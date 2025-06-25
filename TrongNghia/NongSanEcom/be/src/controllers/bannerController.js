import Banner from '../models/Banner.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
/**
 * @desc    Fetch all banners with filtering, pagination, and sorting
 * @route   GET /api/banners
 * @access  Public
 */
export const getBanners = asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    const keyword = req.query.keyword ? {
        $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { subtitle: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};
    
    const position = req.query.position ? { position: req.query.position } : {};
    const isActive = req.query.isActive !== undefined && req.query.isActive !== '' ? { isActive: req.query.isActive === 'true' || req.query.isActive === true } : {};

    // Filter by date range
    const dateFilter = {};
    if (req.query.startDate) {
        dateFilter.startDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
        dateFilter.endDate = { $lte: new Date(req.query.endDate) };
    }

    const count = await Banner.countDocuments({ ...keyword, ...position, ...isActive, ...dateFilter });
    const banners = await Banner.find({ ...keyword, ...position, ...isActive, ...dateFilter })
        .populate('category', 'name')
        .populate('product', 'name images')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name')
        .sort({ priority: -1, createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Chuẩn hóa object pagination
    const pagination = {
      page,
      limit: pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      hasNext: page < Math.ceil(count / pageSize),
      hasPrev: page > 1
    };

    res.json({ banners, pagination });
});

/**
 * @desc    Fetch active banners for public display
 * @route   GET /api/banners/public
 * @access  Public
 */
export const getPublicBanners = asyncHandler(async (req, res) => {
    const { position = 'home', category } = req.query;
    
    const filter = { 
        isActive: true,
        position 
    };

    // Add category filter if specified
    if (category) {
        filter.category = category;
    }

    // Add date filter for active banners
    const now = new Date();
    filter.$or = [
        { startDate: { $exists: false }, endDate: { $exists: false } },
        { startDate: { $lte: now }, endDate: { $exists: false } },
        { startDate: { $exists: false }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: { $gte: now } }
    ];

    const banners = await Banner.find(filter)
        .populate('category', 'name')
        .populate('product', 'name images price')
        .sort({ priority: -1, createdAt: -1 })
        .limit(10);

    res.json(banners);
});

/**
 * @desc    Fetch single banner
 * @route   GET /api/banners/:id
 * @access  Public
 */
export const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id)
        .populate('category', 'name')
        .populate('product', 'name images price')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');
    
    if (banner) {
        res.json(banner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

/**
 * @desc    Create a banner
 * @route   POST /api/banners
 * @access  Private/Admin
 */
export const createBanner = asyncHandler(async (req, res) => {
    const {
        title,
        subtitle,
        description,
        image,
        link,
        linkText,
        position,
        category,
        product,
        isActive,
        startDate,
        endDate,
        priority,
        backgroundColor,
        textColor
    } = req.body;

    const banner = new Banner({
        title,
        subtitle,
        description,
        image,
        link,
        linkText,
        position,
        category,
        product,
        isActive,
        startDate,
        endDate,
        priority,
        backgroundColor,
        textColor,
        createdBy: req.user._id
    });

    const createdBanner = await banner.save();
    
    // Populate references before sending response
    await createdBanner.populate([
        { path: 'category', select: 'name' },
        { path: 'product', select: 'name images' },
        { path: 'createdBy', select: 'name' }
    ]);

    res.status(201).json(createdBanner);
});

/**
 * @desc    Update a banner
 * @route   PUT /api/banners/:id
 * @access  Private/Admin
 */
export const updateBanner = asyncHandler(async (req, res) => {
    const {
        title,
        subtitle,
        description,
        image,
        link,
        linkText,
        position,
        category,
        product,
        isActive,
        startDate,
        endDate,
        priority,
        backgroundColor,
        textColor
    } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.title = title || banner.title;
        banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
        banner.description = description !== undefined ? description : banner.description;
        banner.image = image || banner.image;
        banner.link = link !== undefined ? link : banner.link;
        banner.linkText = linkText !== undefined ? linkText : banner.linkText;
        banner.position = position || banner.position;
        banner.category = category || banner.category;
        banner.product = product || banner.product;
        banner.isActive = isActive !== undefined ? isActive : banner.isActive;
        banner.startDate = startDate !== undefined ? startDate : banner.startDate;
        banner.endDate = endDate !== undefined ? endDate : banner.endDate;
        banner.priority = priority !== undefined ? priority : banner.priority;
        banner.backgroundColor = backgroundColor || banner.backgroundColor;
        banner.textColor = textColor || banner.textColor;
        banner.updatedBy = req.user._id;

        const updatedBanner = await banner.save();
        
        // Populate references before sending response
        await updatedBanner.populate([
            { path: 'category', select: 'name' },
            { path: 'product', select: 'name images' },
            { path: 'createdBy', select: 'name' },
            { path: 'updatedBy', select: 'name' }
        ]);

        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

/**
 * @desc    Delete a banner
 * @route   DELETE /api/banners/:id
 * @access  Private/Admin
 */
export const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    
    if (banner) {
        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

/**
 * @desc    Toggle banner active status
 * @route   PATCH /api/banners/:id/toggle
 * @access  Private/Admin
 */
export const toggleBannerStatus = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    
    if (banner) {
        banner.isActive = !banner.isActive;
        banner.updatedBy = req.user._id;
        
        const updatedBanner = await banner.save();
        
        await updatedBanner.populate([
            { path: 'category', select: 'name' },
            { path: 'product', select: 'name images' },
            { path: 'createdBy', select: 'name' },
            { path: 'updatedBy', select: 'name' }
        ]);

        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

/**
 * @desc    Update banner priority
 * @route   PATCH /api/banners/:id/priority
 * @access  Private/Admin
 */
export const updateBannerPriority = asyncHandler(async (req, res) => {
    const { priority } = req.body;
    
    if (priority === undefined || priority < 0) {
        res.status(400);
        throw new Error('Priority must be a non-negative number');
    }

    const banner = await Banner.findById(req.params.id);
    
    if (banner) {
        banner.priority = priority;
        banner.updatedBy = req.user._id;
        
        const updatedBanner = await banner.save();
        
        await updatedBanner.populate([
            { path: 'category', select: 'name' },
            { path: 'product', select: 'name images' },
            { path: 'createdBy', select: 'name' },
            { path: 'updatedBy', select: 'name' }
        ]);

        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
}); 