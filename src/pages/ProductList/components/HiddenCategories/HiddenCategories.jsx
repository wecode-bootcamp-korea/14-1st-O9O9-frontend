import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import "./HiddenCategories.scss";

class HiddenCategories extends PureComponent {
  render() {
    const { subcategories, categoryId } = this.props;
    return (
      <div className="HiddenCategories">
        {subcategories &&
          subcategories.map((subcategory) => (
            <Link key={subcategory.id} to={`/list?category=${categoryId}&subcategory=${subcategory.id}`}>
              <span>{subcategory.name}</span>
            </Link>
          ))}
      </div>
    );
  }
}

export default HiddenCategories;
