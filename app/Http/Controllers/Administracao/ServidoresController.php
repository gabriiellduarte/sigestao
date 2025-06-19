<?php

namespace App\Http\Controllers\Administracao;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServidoresController extends Controller
{
    public function index(){
        return Inertia::render('Administracao/Servidores/index');
    }
    public function create(){
        return Inertia::render('Administracao/Servidores/criar');
    }
}
