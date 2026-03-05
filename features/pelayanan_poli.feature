Feature: Pelayanan Medis

    In order to record Pelayanan Medis in the clinic
    As a user
    I want to input medical service data for Poli Umum with Resep and Poli Gigi with Pemeriksaan Lab

    Background: 
        Given the user is logged into the system
        And the user has registered a patient

    @poli_umum
    Scenario Outline: User records Pelayanan Medis in the Poli Umum with Resep
        Given the user opens the Pelayanan Poli Umum
        When the user fills in the initial assessment
        And the user fills in the physical examination
        And the user saves the diagnosis
        And the user adds Obat "<nama_obat>" to the Resep
        And the user saves Pelayanan Poli Umum
        Then the system stores the Pelayanan Poli Umum data

    Examples:
        |nama_obat|
        |ACARBOSE 50 TAB DEXA|
        |AMLODIPINE 10MG TABLET|


    @poli_gigi
    Scenario Outline: User records Pelayanan Medis in the Poli Gigi with Pemeriksaan Lab
        Given the user opens the Pelayanan Poli Gigi
        When the user fills in the initial assessment
        And the user fills in the physical examination
        And the user saves the diagnosis
        And the user adds Pemeriksaan Lab "<jenis_pemeriksaan>"
        And the user saves Pelayanan Poli Gigi
        Then the system stores the Pelayanan Poli Gigi data

    Examples:
        |jenis_pemeriksaan|
        |eritrosit|
        |leukosit|
        |trombosit|