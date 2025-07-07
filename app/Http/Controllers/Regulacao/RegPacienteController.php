<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Localidade;
use App\Models\Pessoa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegPacienteController extends Controller
{
    public function index()
    {
        $pacientes = Pessoa::with('localidade')
            ->orderBy('ger_pessoas_nome')
            ->paginate(10);

        return Inertia::render('regulacao/Pacientes/Index', [
            'pacientes' => $pacientes
        ]);
    }

    public function show(){
        $pessoa = Pessoa::find(2);
        return Inertia::render('regulacao/Pacientes/View',['paciente'=>$pessoa]);
    }
    public function create()
    {
        $localidades = Localidade::orderBy('ger_localidades_nome')->get();
        
        return Inertia::render('regulacao/Pacientes/Create', [
            'localidades' => $localidades
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reg_paciente_nome' => 'required|string|max:100',
            'reg_paciente_cns' => 'required|string|max:20',
            'reg_paciente_cpf' => 'nullable|string|max:11',
            'reg_paciente_nascimento' => 'required|date',
            'reg_paciente_telefone1' => 'required|string|max:15',
            'reg_paciente_telefone2' => 'nullable|string|max:15',
            'reg_paciente_endereco' => 'nullable|string|max:80',
            'reg_paciente_endereco_n' => 'nullable|string|max:10',
            'reg_paciente_endereco_bairro' => 'nullable|string|max:20',
            'reg_paciente_mae' => 'nullable|string|max:100',
            'reg_loc_id' => 'nullable|exists:reg_localidades,reg_loc_id'
        ]);

        Pessoa::create($validated);

        return redirect()->route('regulacao.pacientes.index')
            ->with('sucesso', 'Paciente cadastrado com sucesso!');
    }

    public function edit(Pessoa $paciente)
    {
        $localidades = Localidade::orderBy('ger_localidades_nome')->get();
        
        return Inertia::render('regulacao/Pacientes/Edit', [
            'paciente' => $paciente,
            'localidades' => $localidades
        ]);
    }

    public function update(Request $request, Pessoa $paciente)
    {
        $validated = $request->validate([
            'reg_paciente_nome' => 'required|string|max:100',
            'reg_paciente_cns' => 'required|string|max:20',
            'reg_paciente_cpf' => 'nullable|string|max:11',
            'reg_paciente_nascimento' => 'required|date',
            'reg_paciente_telefone1' => 'required|string|max:15',
            'reg_paciente_telefone2' => 'nullable|string|max:15',
            'reg_paciente_endereco' => 'nullable|string|max:80',
            'reg_paciente_endereco_n' => 'nullable|string|max:10',
            'reg_paciente_endereco_bairro' => 'nullable|string|max:20',
            'reg_paciente_mae' => 'nullable|string|max:100',
            'reg_loc_id' => 'nullable|exists:reg_localidades,reg_loc_id'
        ]);

        $paciente->update($validated);

        return redirect()->route('regulacao.pacientes.index')
            ->with('sucesso', 'Paciente atualizado com sucesso!');
    }

    public function destroy(Pessoa $paciente)
    {
        $paciente->delete();

        return redirect()->route('regulacao.pacientes.index')
            ->with('sucesso', 'Paciente excluído com sucesso!');
    }
} 