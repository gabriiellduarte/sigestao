<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BugueirosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nomes = [
            "ALBERICO", "WILKSON", "AIRTON", "JOSE MARIA", "RAIMUNDO",
            "OLAVO", "NERTAN", "DAVI MAIA", "ULISSES", "RAONI",
            "ASTRO", "MATIAS", "CLEYLSON", "BRUNO", "JULIO",
            "ANTONIO", "FRAN. JOSE", "LEO GOMES", "BRENA F.", "SINVALDO",
            "FABIO JOSE", "ERMILSON", "MARCOS", "JANILSON", "MOACIR",
            "EUDES", "FRANC. LIMA", "ARTENISIO R.", "FELIPE OLI.", "DANIEL C.",
            "ALEXANDRE", "ISMAEL", "ITALO", "REGINALDO", "JOSE NILO",
            "FRANC. ASSIS", "MARILENE S", "ARGEU", "WAGNER A.", "DANIEL R.",
            "VANILDO P.", "RICARDO", "RUBENS", "FAGNER", "JOAO PEDRO",
            "CLEINDINALDO", "LUIS ALBERTO", "GABRIEL P.", "ELEUZO", "MARIO PABLO",
            "ALEXSANDRO", "JOSE MARIA V.", "JAILSON", "LUCAS DA SILVA", "MARDON JESON",
            "JOÃO AUGUSTO", "FRANCISCO W.", "LUIS CLAUDIO", "FRANC. ANDRE", "IVAN FERREIRA",
            "CLEBER SILVA", "ANTONIO JOSE", "RICARDO", "ZAQUEU P.", "JOSE IVAN M.",
            "ALBERTO N.", "FRANC. JOSE P.", "SAMIO", "CAIO DA ROCHA", "IURI SANTIAGO",
            "GIULY ANGELO", "RYANE ROCHA", "CRISTOVAM", "MAIRTON C.", "IVAMILTON",
            "ROBERTO", "MARILIA", "MIGUEL", "ADOLFO", "F. KLEBER",
            "MICHELLE", "ANDRE", "L. EDUARDO", "FÁBIO F.", "JORGIVAN",
            "F. ALFREDO", "J. LEONIDAS", "LEANDRO B.", "MÁRCIO N.", "EDILETON",
            "VALDEMI", "ARGELSON", "KELVIN", "AMAURY", "L. CRISTAL",
            "LUCAS N.", "NARCÍLIO", "CARLOS H.", "MÁRIO S.", "NÍCOLAS",
            "FELIPE", "GUSTAVO", "LUIDY F.", "CÉSAR A.", "ARTEMÍSIO",
            "CLAIRTON", "OLÍVIO", "ELITON H.", "CARLOS ALB", "FRANCISCO",
            "GILVAN"
        ];

        foreach ($nomes as $index => $nome) {
            DB::table('bug_bugueiros')->insert([
                'bugueiro_id' => $index + 1,
                'bugueiro_posicao_oficial' => $index + 1,
                'bugueiro_nome' => $nome,
                'bugueiro_cpf' => '00000000000',
                'bugueiro_placa_buggy' => 'AAA0A00',
                'bugueiro_nascimento' => '2000-01-01',
            ]);
        }

    }
}
