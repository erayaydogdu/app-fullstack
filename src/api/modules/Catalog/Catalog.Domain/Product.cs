using FSH.Framework.Core.Domain;
using FSH.Framework.Core.Domain.Contracts;
using FSH.Starter.WebApi.Catalog.Domain.Events;

namespace FSH.Starter.WebApi.Catalog.Domain;
public class Product : AuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public Guid? BrandId { get; private set; }
    public string? ImageUrl { get; private set; }
    public virtual Brand Brand { get; private set; } = default!;

    private Product() { }

    private Product(Guid id, string name, string? description, decimal price, Guid? brandId, string? imageUrl)
    {
        Id = id;
        Name = name;
        Description = description;
        Price = price;
        BrandId = brandId;
        ImageUrl = imageUrl;
        
        QueueDomainEvent(new ProductCreated { Product = this });
    }

    public static Product Create(string name, string? description, decimal price, Guid? brandId,string? imageUrl)
    {
        return new Product(Guid.NewGuid(), name, description, price, brandId, imageUrl);
    }

    public Product Update(string? name, string? description, decimal? price, Guid? brandId, string imageUrl)
    {
        bool isUpdated = false;

        if (!string.IsNullOrWhiteSpace(name) && !string.Equals(Name, name, StringComparison.OrdinalIgnoreCase))
        {
            Name = name;
            isUpdated = true;
        }

        if (!string.Equals(Description, description, StringComparison.OrdinalIgnoreCase))
        {
            Description = description;
            isUpdated = true;
        }

        if (price.HasValue && Price != price.Value)
        {
            Price = price.Value;
            isUpdated = true;
        }

        if (brandId.HasValue && brandId.Value != Guid.Empty && BrandId != brandId.Value)
        {
            BrandId = brandId.Value;
            isUpdated = true;
        }
        
        if (!string.Equals(ImageUrl, imageUrl, StringComparison.OrdinalIgnoreCase))
        {
            ImageUrl = imageUrl;
            isUpdated = true;
        }

        if (isUpdated)
        {
            QueueDomainEvent(new ProductUpdated { Product = this });
        }

        return this;
    }
}

