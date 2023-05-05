using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        private UserManager<AppUser> _userManager { get; }

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerUser)
        {
            if (await UserExists(registerUser.UserName))
            {
                return BadRequest("User already exists");
            }

            var user = _mapper.Map<AppUser>(registerUser);

            //using var hmac = new HMACSHA512();

            user.UserName = registerUser.UserName;
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerUser.Password));
            //user.PasswordSalt = hmac.Key;

            var result = await _userManager.CreateAsync(user, registerUser.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Alias = user.Alias,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto login)
        {
            var user = await _userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(user => user.UserName == login.UserName);

            if (user == null)
            {
                return Unauthorized("Invalid User");
            }
            var result = await _userManager.CheckPasswordAsync(user, login.Password);

            if (!result) return Unauthorized("Invalid password");

            //using var hmac = new HMACSHA512(user.PasswordSalt);

            //var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

            //for (int i =0; i< computedHash.Length; i++)
            //{
            //    if (computedHash[i] != user.PasswordHash[i])
            //    {
            //        return Unauthorized("Invalid Password");
            //    }
            //}

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Alias = user.Alias,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string userName)
        {
            return await _userManager.Users.AnyAsync(u => u.UserName == userName.ToLower());
        }
    }
}
