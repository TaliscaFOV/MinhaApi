using MinhaApi.Models;
using MinhaApi.Repositories;

public class TipoRepository
    : ITipoRepository
{
    private static List<Tipo> _db = new()
    {
        new Tipo { Id = 1, Nome = "Asus"},

        new Tipo {Id = 2, Nome = "Mchose"}
    };

    public IEnumerable<Tipo> GetAll()
        => _db;
    
    public Tipo? GetById(int id)
        => _db.FirstOrDefault(t => t.Id == id);
    
    public void Add(Tipo t)
    {
        t.Id = _db.Any() ? _db.Max (x => x.Id) + 1 : 1;
        _db.Add(t);
    }

    public void Update(Tipo t)
    {
        var i = _db.FindIndex(x => x.Id == t.Id);
        if (i >= 0) _db[i] = t;
    }

    public void Delete(int id)
        => _db.RemoveAll(t => t.Id == id);
}