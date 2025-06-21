import { PAGINATION } from '../constants/index.js';

/**
 * Parse pagination parameters from request query
 */
export const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

/**
 * Create pagination object for response
 */
export const createPaginationObject = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
};

/**
 * Apply pagination to Mongoose query
 */
export const applyPagination = (query, paginationParams) => {
  return query
    .skip(paginationParams.skip)
    .limit(paginationParams.limit);
};

/**
 * Get paginated results with total count
 */
export const getPaginatedResults = async (model, filter = {}, paginationParams, sort = {}) => {
  const [data, total] = await Promise.all([
    model.find(filter).sort(sort).skip(paginationParams.skip).limit(paginationParams.limit),
    model.countDocuments(filter),
  ]);
  
  return createPaginationObject(data, total, paginationParams.page, paginationParams.limit);
}; 