using Microsoft.Extensions.DependencyInjection;

namespace RpsAPI
{
    public static class Extensions
    {
        public static void AddCorsForClient(this IServiceCollection services, string name)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name, policy =>
                {
                    policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000")
                        .AllowCredentials();
                });
            });
        }
    }
}