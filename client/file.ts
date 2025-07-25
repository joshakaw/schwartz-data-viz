var response = {
    "schoolNames": [
        {
            "schoolName": "Ornport Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Maggioside College",
            "schoolType": "college"
        },
        {
            "schoolName": "Jeromymouth Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Lake Nelleshire Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Highland College",
            "schoolType": "college"
        },
        {
            "schoolName": "Lake Emmatown Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Juniorchester High",
            "schoolType": "high"
        },
        {
            "schoolName": "Connellymouth High",
            "schoolType": "high"
        },
        {
            "schoolName": "Jaycemouth Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Petaluma Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "North Quincycester High",
            "schoolType": "high"
        },
        {
            "schoolName": "Greggside Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Mannview Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Silver Spring High",
            "schoolType": "high"
        },
        {
            "schoolName": "Ocala Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Port Brookefort High",
            "schoolType": "high"
        },
        {
            "schoolName": "Winfieldburgh College",
            "schoolType": "college"
        },
        {
            "schoolName": "Lake Antonina Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "Wunschfort Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Brayanton Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Harberstad College",
            "schoolType": "college"
        },
        {
            "schoolName": "Schillerside Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "East Talonbury Elementary",
            "schoolType": "elementary"
        },
        {
            "schoolName": "Lake Generalworth Middle",
            "schoolType": "middle"
        },
        {
            "schoolName": "O'Konton Middle",
            "schoolType": "middle"
        }
    ],
    "schoolTypes": [
            {
                "schoolType": "middle"
            },
            {
                "schoolType": "college"
            },
            {
                "schoolType": "elementary"
            },
            {
                "schoolType": "high"
            }
        ]
}

var inputData = response.schoolTypes.map((typeObj) => {
    return {
        label: typeObj.schoolType, // Parent
        value: typeObj.schoolType,
        children: response.schoolNames
            .filter((school) => school.schoolType === typeObj.schoolType)
            .map((school) => school.schoolName)
    };
});
