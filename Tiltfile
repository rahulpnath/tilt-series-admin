docker_compose('compose.yaml', project_name='shop-admin')

dc_resource('web', new_name='admin-web', labels=['admin'], links=['https://admin.localhost'])
