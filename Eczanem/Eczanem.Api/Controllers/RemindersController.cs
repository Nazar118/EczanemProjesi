// Controllers/RemindersController.cs
using Eczanem.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Eczanem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RemindersController : ControllerBase
    {
        private readonly IReminderService _reminderService;

        public RemindersController(IReminderService reminderService)
        {
            _reminderService = reminderService;
        }

        // GET: api/Reminders/Check
        // Bu adrese istek atıldığında, hatırlatma yapılması gereken satışları döndürür.
        [HttpGet("Check")]
        public async Task<IActionResult> CheckReminders()
        {
            var reminders = await _reminderService.GetSalesNeedingReminderAsync();

            if (!reminders.Any())
            {
                return Ok("Hatırlatma yapılacak hasta bulunamadı.");
            }

            return Ok(reminders);
        }
    }
}