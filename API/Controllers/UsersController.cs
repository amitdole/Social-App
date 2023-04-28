using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
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
        public async Task<ActionResult<PagedList<FriendDto>>> GetUsers([FromQuery] UserParams userparams)
        {
            var currentUser = await _userRepository.GetUserByUserNameAsync(User.GetUserName());
            userparams.CurrentUsername = currentUser.UserName;

            if (string.IsNullOrEmpty(userparams.Gender) )
            {
                userparams.Gender = currentUser.Gender == "male" ? "male" : "female";
            }

            var friends = await _userRepository.GetFriendsAsync(userparams);

            //var usersDTo = _mapper.Map<IEnumerable<FriendDto>>(users);

            Response.AddPaginationHeader(new PaginationHeader(friends.CurrentPage, friends.PageSize, friends.TotalCount, friends.TotalPages));

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

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var userName = User.GetUserName();

            var user = await _userRepository.GetUserByUserNameAsync(userName);

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
                return BadRequest("You cannot delete main photo!");
            }

            if (photo.publicId != null)
            {
                var resutl = await _photoService.DeletePhotoSync(photo.publicId);

                if (resutl.Error != null)
                {
                    return BadRequest(resutl.Error.Message);
                }
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Problem Deleting photo");
        }
    }
}
