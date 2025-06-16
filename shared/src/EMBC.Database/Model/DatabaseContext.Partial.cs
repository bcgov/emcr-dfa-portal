using Microsoft.Xrm.Sdk;

namespace EMBC.Database.Model;
    
public partial class DatabaseContext
{
    private bool isInTransaction;

    public new SaveChangesResultCollection SaveChanges()
    {
        if (!isInTransaction)
        {
            return base.SaveChanges();
        }

        return null;
    }

    public TransactionContext BeginTransaction()
    {
        if (isInTransaction) throw new InvalidOperationException("Already in a transaction");
        isInTransaction = true;
        return new TransactionContext(this);
    }

    public void CommitTransaction()
    {
        if (isInTransaction)
        {
            base.SaveChanges();
            isInTransaction = false;
        }
    }
}

public class TransactionContext
{
    private readonly DatabaseContext _context;
    public TransactionContext(DatabaseContext context)
    {
        _context = context;
    }

    public void Commit() => _context.CommitTransaction();
}
