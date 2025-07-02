<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Log;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;

class InjectXdebugCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $debug = config('app.debug');
        //Log::info('debug: ' . $debug);
        if ($debug) {
            $cookie = new Cookie('XDEBUG_TRIGGER', '1', 0, '/', null, false, false);
            $response->headers->setCookie($cookie);
        }

        return $response;
    }
}
