# Admin on its own, or included by the workspace Tiltfile.
docker_compose(['docker/compose.yaml'], project_name='shop-admin')

dc_resource('admin-web', labels=['admin'], links=['http://localhost:5174'])
