# The App 🚀

> With ASP.NET Core Web API & Blazor Client & NextJs UI

 `.NET 9 Clean Architecture` Solution that incorporates the most essential packages and features your projects will ever need including out-of-the-box Multi-Tenancy support. 

# 🔎 The Project

# ✨ Technologies

- .NET 9
- Entity Framework Core 9
- Blazor
- NextJs
- MediatR
- PostgreSQL
- Redis
- FluentValidation

# 👨‍🚀 Architecture

# 📬 Service Endpoints

Here is the swagger link https://localhost:7000/swagger/v1/swagger.json



# 📝 Notes

## Add Migrations

Navigate to `./api/server` and run the following EF CLI commands.

```bash
dotnet ef migrations add "Add Identity Schema" --project .././migrations/postgresql/ --context IdentityDbContext -o Identity
dotnet ef migrations add "Add Tenant Schema" --project .././migrations/postgresql/ --context TenantDbContext -o Tenant
dotnet ef migrations add "Add Todo Schema" --project .././migrations/postgresql/ --context TodoDbContext -o Todo
dotnet ef migrations add "Add Catalog Schema" --project .././migrations/postgresql/ --context CatalogDbContext -o Catalog
```

## What's Pending?

- Few Identity Endpoints
- File Storage Service
- Source Code Generation
- Searching / Sorting


