using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;
        private readonly Random _rnd;

        public TestController(ILogger<TestController> logger)
        {
            _rnd = new Random();
            _logger = logger;
        }

        [HttpGet(Name = "next")]
        public ActionResult<int> Get()
        {
            return _rnd.Next();
        }

        [HttpGet("{max:int}")]
        public ActionResult<int> GetWithMax(int max)
        {
            if (max < 1)
                return BadRequest();

            return _rnd.Next(0, max);
        }
    }
}
