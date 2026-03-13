Feature: Pelayanan

    Background:
        Given user navigates to login page
        When user enters valid username and password
        And user clicks login button
        Then user will be directed to the select puskesmas page
        When user selects puskesmas
        Then user will be directed to the home page

    @search-pasien-asuransi-umum
    Scenario: User successfully search patient asuransi umum with NIK
        Given user in pendaftaran pasien & kk page
        When user search patient asuransi umum with "<nik>"
        Then user can see "<nama>" pasien nama in table
        And user can see "<nik>" pasien nik in table

        Examples:
            | nik              | nama              |
            | 1295012906892673 | TEST ENCRYPT FAIL |
