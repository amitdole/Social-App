using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        //[AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendDto>>> GetUsers()
        {
            var friends = await _userRepository.GetFriendsAsync();

            //var usersDTo = _mapper.Map<IEnumerable<FriendDto>>(users);

            return Ok(friends);
        }

        [HttpGet("{userName}")]
        public async Task<ActionResult<FriendDto>> GetUser(string userName)
        {
            var friend = await _userRepository.GetFriendByUserNameAsync(userName);

            //var userDTo = _mapper.Map<FriendDto>(user);

            return Ok(friend);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(FriendUpdateDto friendUpdateDto)
        {
            var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var user = await _userRepository.GetUserByUserNameAsync(userName);

            if (user == null)
            {
                return NotFound();
            }

            _mapper.Map(friendUpdateDto, user);

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Falied to update user");
        }
    }
}
