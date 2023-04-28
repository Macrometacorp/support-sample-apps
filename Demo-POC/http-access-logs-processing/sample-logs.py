import random
import time

# List of HTTP methods to choose from
http_methods = ['GET', 'POST', 'PUT', 'DELETE']

# List of URLs to choose from
urls = ['/cgi-bin/try/', 
        '/',
        '/about',
        '/contact',
        '/products',
        '/services',
        '/blog',
        '/news',
        '/events',
        '/faq',
        '/support',
        '/login',
        '/logout',
        '/register',
        '/reset-password',
        '/search',
        '/sitemap',
        '/terms-of-service',
        '/privacy-policy',
        '/404',
        '/500',
        '/admin',
        '/dashboard',
        '/profile']

# Prompt user for the number of logs to generate
num_logs = int(input('Enter the number of logs to generate: '))

# Open a new log file to write to
with open('access.log', 'w') as f:
    # Loop through and generate the specified number of logs
    for i in range(num_logs):
        # Generate a random IP address
        ip_address = '{}.{}.{}.{}'.format(*[random.randint(0, 255) for _ in range(4)])
        
        # Generate a random timestamp
        timestamp = time.strftime('[%d/%b/%Y:%H:%M:%S %z]')
        
        # Choose a random HTTP method and URL
        http_method = random.choice(http_methods)
        url = random.choice(urls)
        
        # Generate a random status code
        status_code = random.choice([200, 201, 204, 301, 302, 400, 401, 403, 404, 500])
        
        # Generate a random response size
        response_size = random.randint(100, 10000)
        
        # Write the log entry to the file
        f.write('{} - - {} "{} {} HTTP/1.0" {} {}\n'.format(ip_address, timestamp, http_method, url, status_code, response_size))