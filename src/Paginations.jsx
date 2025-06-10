// Pagination.jsx
export default function Pagination ({ page, onPageChange, maxPage = 500 }) {
    return (
     
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-sm">
            
            <li>
              <a
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${page === 1 ? "cursor-not-allowed pointer-events-none opacity-50" : "dark:hover:text-white"}`}
                onClick={() => page > 1 && onPageChange(1)}
              >
                First Page
              </a>
            </li>
            <li>
              <a
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${page >= maxPage ? "cursor-not-allowed pointer-events-none opacity-50" : "dark:hover:text-white"}`}
                onClick={() => page < maxPage && onPageChange(page - 1)}
              >
                {page <= 1 ? "-": page - 1 }
              </a>
            </li>
            <li>
              <a
                aria-current="page"
                className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                onClick={(e) => e.preventDefault()}
              >
                {page}
              </a>
            </li>
            <li>
              <a
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ${page >= maxPage ? "cursor-not-allowed pointer-events-none opacity-50" : "dark:hover:text-white"}`}
                onClick={() => page < maxPage && onPageChange(page + 1)}
              >
                {page < maxPage ? page + 1 : "-"}
              </a>
            </li>
            <li>
              <a
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => onPageChange(maxPage)}
              >
                Last Page
              </a>
            </li>
            
          </ul>
        </nav>
    );
  };
  