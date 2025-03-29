using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11Assignment.API.Data;

namespace Mission11Assignment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all books
        [HttpGet]
        public async Task<ActionResult> GetBooks(
    string? category,
    int page = 1,
    int pageSize = 5,
    string sortBy = "title",
    bool ascending = true)
        {
            var query = _context.Books.AsQueryable();

            // Optional filtering
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // Optional sorting (only allow "title" for now)
            query = ascending
                ? query.OrderBy(b => b.Title)
                : query.OrderByDescending(b => b.Title);

            var totalBooks = await query.CountAsync();

            // Pagination
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Data = books,
                TotalCount = totalBooks
            });
        }
    }
}
