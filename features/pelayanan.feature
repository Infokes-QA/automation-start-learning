Feature: Pelayanan

    Background:
        Given user navigates to login page
        When user enters valid username and password
        And user clicks login button
        Then user will be directed to the select puskesmas page
        When user selects puskesmas
        Then user will be directed to the home page

    @search-pasien
    Scenario: User successfully search patient asuransi umum with NIK
        Given user in pendaftaran pasien & kk page
        When user search patient asuransi umum with "<nik>"
        Then user can see "<nama>" pasien nama in table
        And user can see "<nik>" pasien nik in table
        Examples:
            | nik              | nama              |
            | 0099887766554433 | CITRA TES 3 |
            
    @create-pasien-umum
    Scenario: User successfuylly create pasien asuransi umum
        Given user in pendaftaran pasien & kk page
        When user navigates to create pasien page
        Then user will be directed to create pasien page

    @create-pasien-asuransi-umum
    Scenario Outline: Create pasien from data file
        Given user is in create pasien page
        When user fill create pasien form using data index <index>
        And user click submit button
        Then user can see nik from index <index> in table

        Examples:
        | index |
        | 0     |
        | 1     |