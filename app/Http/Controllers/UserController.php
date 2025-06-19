<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles', 'permissions')->get();
        $roles = Role::with('permissions')->get();
        
        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        return Inertia::render('Users/Edit', [
            'user' => $user->load(['roles', 'permissions']),
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('Users/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
            'roles' => 'array',
            'permissions' => 'array'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->roles) {
            $user->syncRoles($request->roles);
        }

        if ($request->permissions) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('users.index');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'roles' => 'array',
            'permissions' => 'array'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->has('password') && $request->password) {
            $request->validate([
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
            $user->update(['password' => Hash::make($request->password)]);
        }

        if ($request->roles) {
            $user->syncRoles($request->roles);
        }

        if ($request->permissions) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Não é possível excluir seu próprio usuário!');
        }

        $user->delete();
        return redirect()->route('users.index');
    }
} 