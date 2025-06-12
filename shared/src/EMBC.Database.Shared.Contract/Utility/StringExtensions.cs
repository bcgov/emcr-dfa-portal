namespace Shared.Contract;

public static class StringExtensions
{
    public static string Truncate(this string n, int length)
    {
        if (string.IsNullOrEmpty(n))
            return n;
        if (length > 3)
            return n.Length <= length ? n : n.Substring(0, length - 3) + "...";
        else
            return n.Length <= length ? n : n.Substring(0, length);
    }
}
