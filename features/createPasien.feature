Feature: Buat Pasien

    Background:
        Given user navigates to login page
        When user enters valid username and password
        And user clicks login button
        Then user will be directed to the select puskesmas page
        When user selects puskesmas
        Then user will be directed to the home page

    @buatPasien
    Scenario Outline: User register new patient with asuransi umum laki-laki & perempuan
        Given user in pendaftaran pasien & kk page
        When user create new patient asuransi umum "<jenisPasien>"
        Then user can see registered "<jenisPasien>" pasien data

        Examples:
            | jenisPasien |
            | laki-laki   |
            | perempuan   |
