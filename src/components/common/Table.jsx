import PropTypes from 'prop-types';
import '../../styles/Table.css';
import '../../styles/Badge.css';
import '../../styles/Button.css';
import '../../styles/Pagination.css';
import '../../styles/Search.css';
import '../../styles/Navbar.css';

const Table = ({ data, headers, handleSort, sortBy, sortDesc,  }) => {
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  style={{ width: header.width || 'auto' }}
                  onClick={() => handleSort(header.key)}
                  className="col"
                >
                  <div className="header-content">
                    {header.label}
                    {/* Sort icon */}
                    <i
                      className={`fa ${
                        sortBy === header.key
                          ? sortDesc
                            ? 'fa-sort-down' // descending
                            : ''   // ascending
                          : 'fa-sort-down'        // default sort icon for unsorted columns
                      }`}
                      style={{ marginLeft: '5px' }}
                    ></i>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {headers.map((header) => (
                  <td key={header.key} className="data-row">
                    {header.render ? header.render(item) : item[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  handleSort: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDesc: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Table;
