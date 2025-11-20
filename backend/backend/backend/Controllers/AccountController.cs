using backend.Models;
using backend.Models_DTO;
using backend.Utils.Extension;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        public AccountController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        /// <summary>
        ///     Simon Déry - 19 novembre 2025
        ///     Permet de créer un utilisateur au sein de l'application
        /// </summary>
        /// <param name="registerForm">Objet contenant les information de l'utilisateurs</param>
        /// <returns></returns>
        [HttpPost(nameof(Create))]
        public async Task<IActionResult> Create([FromBody] RegisterForm registerForm)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            User user = registerForm.ToUser();

            IdentityResult? result = await _userManager.CreateAsync(user, registerForm.Password);

            if (result.Succeeded)
            {
                string token = await _userManager.GenerateJwtTokenAsync(user);
                return Ok(token);
            }
            else
            {
                foreach (IdentityError error in result.Errors)
                {
                    if (error.Code != "DuplicateUserName")
                        ModelState.AddModelError("errors", error.Code);
                }

                return BadRequest(ModelState);
            }
        }

        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            return Ok(new { userId, email, message = "Token is valid!" });
        }
    }
}
