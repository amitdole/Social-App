using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Linq.Expressions;

namespace API.Converters
{
    public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
    {
        public DateOnlyConverter()
            : base(dateonly => dateonly.ToDateTime(TimeOnly.MinValue),
                  datetime => DateOnly.FromDateTime(datetime))
        {
        }
    }
}