using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
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
            var userName = User.GetUserName();

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

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            if (file == null)
            {
                return BadRequest("File not uploaded/Bad file.");
            }

            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user == null)
            {
                return NotFound();
            }

            var result = await _photoService.AddPhotosAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDto>(photo);    
                return CreatedAtAction(nameof(GetUser),
                    new { userName = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUserNameAsync(User.GetUserName());

            if (user == null)
            {
                return NotFound();
            }

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null)
            {
                return NotFound();
            }

            if (photo.IsMain)
            {
                return BadRequest("This is already your main photo");
            }

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }

            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Problem updating main photo");
        }
    }
}
