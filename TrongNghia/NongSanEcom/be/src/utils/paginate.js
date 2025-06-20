export const paginate = async (Model, query = {}, page = 1, limit = 8, sort = {}) => {
  const skip = (page - 1) * limit;
  const total = await Model.countDocuments(query);
  const pages = Math.ceil(total / limit);
  const data = await Model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  return { data, page, pages, total };
}; 