<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use App\Models\Localidade;
use App\Models\LogActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogsController extends Controller
{
    public function index()
    {
        $logs = LogActivity::orderByDesc('created_at')
            ->limit(100)
            ->get();

        // Decodifica o JSON de properties
        $logs = $logs->map(function($log) {
            $log->properties = json_decode($log->properties, true);
            return $log;
        });

        return Inertia::render('Administracao/Logs/LogsIndex', [
            'logs' => $logs
        ]);
    }

    public function show($id)
    {
        $log = LogActivity::where('id', $id)->first();
        if ($log) {
            $log->properties = json_decode($log->properties, true);
        }
        return Inertia::render('Administracao/Logs/LogsShow', [
            'log' => $log
        ]);
    }

   
} 