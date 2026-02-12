'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

const host = Env.get('HOST', '127.0.0.1')
const port = Env.get('PORT', '3333')
let appUrl = Env.get('APP_URL', `http://${host}:${port}`)

if (appUrl.includes('${HOST}') || appUrl.includes('${PORT}')) {
	appUrl = appUrl.replace('${HOST}', host).replace('${PORT}', port)
}

Route.on('/').render('welcome')

Route.post('files/upload', 'FileController.upload')

Route.put('files/update', 'FileController.update')

Route.delete('files/delete', 'FileController.delete')

Route.get('files/:file', 'FileController.download')
