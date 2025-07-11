namespace EMBC.Utilities.Extensions
{
    public static class ConvertEx
    {
        public static bool ToBool(this bool? value) => value ?? false;
    }
}
