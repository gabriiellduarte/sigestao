<?php

namespace App\Http\Controllers\Regulacao;

use App\Http\Controllers\Controller;
use App\Models\Regulacao\RegPaciente;
use App\Models\Regulacao\RegLocalidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegPacienteController extends Controller
{
    public function index()
    {
        $pacientes = RegPaciente::with('localidade')
            ->orderBy('reg_paciente_nome')
            ->paginate(10);

        return Inertia::render('regulacao/Pacientes/Index', [
            'pacientes' => $pacientes
        ]);
    }

    public function create()
    {
        $localidades = RegLocalidade::orderBy('reg_loc_nome')->get();
        
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

        RegPaciente::create($validated);

        return redirect()->route('regulacao.pacientes.index')
            ->with('sucesso', 'Paciente cadastrado com sucesso!');
    }

    public function edit(RegPaciente $paciente)
    {
        $localidades = RegLocalidade::orderBy('reg_loc_nome')->get();
        
        return Inertia::render('regulacao/Pacientes/Edit', [
            'paciente' => $paciente,
            'localidades' => $localidades
        ]);
    }

    public function update(Request $request, RegPaciente $paciente)
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

    public function destroy(RegPaciente $paciente)
    {
        $paciente->delete();

        return redirect()->route('regulacao.pacientes.index')
            ->with('sucesso', 'Paciente excluído com sucesso!');
    }
} 