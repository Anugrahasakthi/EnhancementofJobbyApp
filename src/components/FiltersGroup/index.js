// src/components/FiltersGroup/index.js
import './index.css'

const FiltersGroup = ({filters, onChangeFilter}) => {
  const {categories, ratings} = filters

  const handleFilterChange = (type, value) => {
    onChangeFilter(type, value)
  }

  return (
    <div className="filters-group">
      <h3>Filters</h3>
      <div className="filters-section">
        <h4>Categories</h4>
        <select
          onChange={e => handleFilterChange('category', e.target.value)}
          className="filters-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="filters-section">
        <h4>Ratings</h4>
        <select
          onChange={e => handleFilterChange('rating', e.target.value)}
          className="filters-select"
        >
          {ratings.map(rating => (
            <option key={rating} value={rating}>
              {rating} ⭐
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FiltersGroup
