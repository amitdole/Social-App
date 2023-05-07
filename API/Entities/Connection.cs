namespace API.Entities
{
    public class Connection
    {
        public Connection()
        {
            
        }
        public Connection(string connectionid, string userName)
        {
            Connectionid = connectionid;
            UserName = userName;
        }

        public string Connectionid { get; set; }

        public string UserName { get; set; }
    }
}
