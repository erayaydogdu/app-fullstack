using FSH.Framework.Core.Persistence;
using FSH.Starter.WebApi.Catalog.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FSH.Starter.WebApi.Catalog.Infrastructure.Persistence;
internal sealed class CatalogDbInitializer(
    ILogger<CatalogDbInitializer> logger,
    CatalogDbContext context) : IDbInitializer
{
    public async Task MigrateAsync(CancellationToken cancellationToken)
    {
        if ((await context.Database.GetPendingMigrationsAsync(cancellationToken)).Any())
        {
            await context.Database.MigrateAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] applied database migrations for catalog module", context.TenantInfo!.Identifier);
        }
    }

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        
        if (await context.Products.AnyAsync().ConfigureAwait(false) is false)
        {
            var products = new List<Product>();
            for (var i = 1; i <= 25; i++)
            {
                string Name = $"{i} Keychron V6 QMK Custom Wired Mechanical Keyboard";
                string Description = "A full-size layout QMK/VIA custom mechanical keyboard";
                decimal Price = 25;
                Guid? BrandId = null;
                string ImageUrl = "https://www.keychron.co.nl/cdn/shop/products/Keychron-V6-QMK-VIA-custom-mechanical-keyboard-100-percent-layout-hot-swappable-PBT-keycaps-Keychron-K-Pro-switch-red-ISO-German-layout.jpg?v=1707488650&width=500";
                products.Add(Product.Create(Name, Description, Price, BrandId,ImageUrl));
            }
            
            //var product = Product.Create(Name, Description, Price, BrandId,ImageUrl);
            await context.Products.AddRangeAsync(products, cancellationToken);
            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] seeding default catalog data", context.TenantInfo!.Identifier);
        }
        
        
        if (await context.Brands.AnyAsync().ConfigureAwait(false) is false)
        {
            var brands = new List<Brand>();
            for (var i = 1; i <= 10; i++)
            {
                string Name = $"{i} Apple";
                string Description = "A nice brand";
                brands.Add(Brand.Create(Name, Description));
            }
            
            await context.Brands.AddRangeAsync(brands, cancellationToken);
            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
            logger.LogInformation("[{Tenant}] seeding default catalog data", context.TenantInfo!.Identifier);
        }
    }
}
