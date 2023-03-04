using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class FriendDto
    {
        [Key]
        public int Id { get; set; }

        public string UserName { get; set; }

        public string PhotoUrl { get; set; }

        public int Age { get; set; }

        public string Alias { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string Gender { get; set; }

        public string Introduction { get; set; }

        public string Hobbies { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public List<PhotoDto> Photos { get; set; }
    }
}
