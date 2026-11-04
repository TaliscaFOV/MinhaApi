public class DashboardResumo
{
    public int     TotalVendas   { get; set; }
    public decimal Faturamento   { get; set; }
    public decimal TicketMedio   { get; set; } // calculado na Service
    public int     TotalClientes { get; set; }
}