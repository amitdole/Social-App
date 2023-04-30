using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likesParams.predicate == "liked")
            {
                likes = likes.Where(l => l.SourceUserId == likesParams.userId);
                users = likes.Select(l => l.TargetUser);
            }

            if (likesParams.predicate == "likedBy")
            {
                likes = likes.Where(l => l.TargetUserId == likesParams.userId);
                users = likes.Select(l => l.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                id = user.Id,
                UserName = user.UserName,
                Alias = user.Alias,
                PhotoUrl = user.Photos.First(x => x.IsMain).Url,
                Age = user.GetAge(),
                City = user.City
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LinkedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}
