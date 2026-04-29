// Controllers/StocksController.cs
using Eczanem.Api.Interfaces;
using Eczanem.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StocksController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StocksController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var stocks = await _stockService.GetAllStocksAsync();
            return Ok(stocks);
        }

        [HttpPost]
        public async Task<IActionResult> AddStock([FromBody] Stock stock)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var createdStock = await _stockService.AddStockAsync(stock);
            return Ok(createdStock);
        }
    }
}