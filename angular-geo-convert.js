angular.module("geoConverter")
.factory('geoConverter', function () {
    return {
        lambert2wgs : function(x,y){
            //Lambert 2 init values
            location = {};
            location.T_X_Lamb = {};
            location.T_Y_Lamb = {};
            location.T_X_Lamb.value = x;
            location.T_Y_Lamb.value = y;
            //Convert Lambert 2 to NTF
            location.T_Lat_Deg_G = {}
            location.T_Lat_Min_G = {}
            location.T_Lat_Sec_G = {}
            location.T_Long_Deg_G = {}
            location.T_Long_Min_G = {}
            location.T_Long_Sec_G = {}
            location.selectNS2 = {}
            location.selectEW2 = {}
            Lamb_NTF(location);
            //Convert NTF to ED50
            location.T_Lat_Deg_P = {}
            location.T_Lat_Min_P = {}
            location.T_Lat_Sec_P = {}
            location.T_Long_Deg_P = {}
            location.T_Long_Min_P = {}
            location.T_Long_Sec_P = {}
            location.selectNS1 = {}
            location.selectEW1 = {}
            NTF_ED50(location);
            //convert ED50 to UTM
            location.T_Fus_UTM = {}
            location.T_Ban_UTM = {}
            location.T_Zon_UTM = {}
            location.T_X_UTM = {}
            location.T_Y_UTM = {}
            ED50_UTM(location)
            //Convert UTM to WGS
            location.T_Lat_Deg_W = {}
            location.T_Lat_Min_W = {}
            location.T_Lat_Sec_W = {}
            location.T_Long_Deg_W = {}
            location.T_Long_Min_W = {}
            location.T_Long_Sec_W = {}
            location.selectNS3 = {}
            location.selectEW3 = {}
            Hayford_Iagrs(location)

            return {
                latitude:location.T_Lat_Deg_W.value, 
                longitude:location.T_Long_Deg_W.value,
            }
        },
		lambert2ntf : function(x,y){
            //Lambert 2 init values
            location = {};
            location.T_X_Lamb = {};
            location.T_Y_Lamb = {};
            location.T_X_Lamb.value = x;
            location.T_Y_Lamb.value = y;
            //Convert Lambert 2 to NTF
            location.T_Lat_Deg_G = {}
            location.T_Lat_Min_G = {}
            location.T_Lat_Sec_G = {}
            location.T_Long_Deg_G = {}
            location.T_Long_Min_G = {}
            location.T_Long_Sec_G = {}
            location.selectNS2 = {}
            location.selectEW2 = {}
            Lamb_NTF(location);

            return {
                latitude:location.T_Lat_Deg_G.value, 
                longitude:location.T_Long_Deg_G.value,
            }
        },
		lambert2ed50 : function(x,y){
            //Lambert 2 init values
            location = {};
            location.T_X_Lamb = {};
            location.T_Y_Lamb = {};
            location.T_X_Lamb.value = x;
            location.T_Y_Lamb.value = y;
            //Convert Lambert 2 to NTF
            location.T_Lat_Deg_G = {}
            location.T_Lat_Min_G = {}
            location.T_Lat_Sec_G = {}
            location.T_Long_Deg_G = {}
            location.T_Long_Min_G = {}
            location.T_Long_Sec_G = {}
            location.selectNS2 = {}
            location.selectEW2 = {}
            Lamb_NTF(location);
            //Convert NTF to ED50
            location.T_Lat_Deg_P = {}
            location.T_Lat_Min_P = {}
            location.T_Lat_Sec_P = {}
            location.T_Long_Deg_P = {}
            location.T_Long_Min_P = {}
            location.T_Long_Sec_P = {}
            location.selectNS1 = {}
            location.selectEW1 = {}
            NTF_ED50(location);

            return {
                latitude:location.T_Lat_Deg_P.value, 
                longitude:location.T_Long_Deg_P.value,
            }
        },
		lambert2utm : function(x,y){
            //Lambert 2 init values
            location = {};
            location.T_X_Lamb = {};
            location.T_Y_Lamb = {};
            location.T_X_Lamb.value = x;
            location.T_Y_Lamb.value = y;
            //Convert Lambert 2 to NTF
            location.T_Lat_Deg_G = {}
            location.T_Lat_Min_G = {}
            location.T_Lat_Sec_G = {}
            location.T_Long_Deg_G = {}
            location.T_Long_Min_G = {}
            location.T_Long_Sec_G = {}
            location.selectNS2 = {}
            location.selectEW2 = {}
            Lamb_NTF(location);
            //Convert NTF to ED50
            location.T_Lat_Deg_P = {}
            location.T_Lat_Min_P = {}
            location.T_Lat_Sec_P = {}
            location.T_Long_Deg_P = {}
            location.T_Long_Min_P = {}
            location.T_Long_Sec_P = {}
            location.selectNS1 = {}
            location.selectEW1 = {}
            NTF_ED50(location);
            //convert ED50 to UTM
            location.T_Fus_UTM = {}
            location.T_Ban_UTM = {}
            location.T_Zon_UTM = {}
            location.T_X_UTM = {}
            location.T_Y_UTM = {}
            ED50_UTM(location)

            return {
                latitude:location.T_X_UTM.value, 
                longitude:location.T_Y_UTM.value,
            }
        }
		
    };
});

/*
Convention d'écriture des variables
Hayford_x concerne le goïde ED50 pour Priam en Saxagésimal et UTM
Iagrs_x concerne le goïde WGS84 pour GPS et translation WGS72
Clarke_x concerne le goïde NTF pour Géoconcept en sexagésimal et Lambert II étendu
x_C_xxx concerne les calculs sur Clarke - 1
x_I_xxx concerne les calculs sur Iagrs - 2
x_H_xxx concerne les calculs sur Hayford - 3
Pri_xxx = Priam - ED50 -  Hayford - UTM - 3
Geo_xxx = Geoconcept - NTF - Clarke - Lambert - 1
Gps_xxx = GPS - WGS84 - WGS72 - 2
UTM_xxx = Conversion UTM avec décomposition des caractères alphanumériques
*/

function Hayford_Clarke(form)
/* De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GeoConcept (NTF) Sexa - Clarke 1880 (1) */
	{
	// Constantes Ellipsoïde Hayford PRIAM ED50
	var Hayford_a = 6378388.00;
	var Hayford_f = 297;
	var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);
	// la valeur e est en fait e au carré
	var Hayford_e = (Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2);

	/* Constantes Ellipsoïde Clarke GeoConcept NTF */
	var Clarke_a = 6378249.2;
	var Clarke_b = 6356515;
	var Clarke_f = 1 / ((Clarke_a - Clarke_b) / Clarke_a);
	// la valeur e est en fait e au carré
	var Clarke_e = (Math.pow(Clarke_a,2) - Math.pow(Clarke_b,2)) / Math.pow(Clarke_a,2);

	/* Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 1 */
	var Tx = 84;
	var Ty = -37;
	var Tz = -437;

	/* Coordonnées LONGITUDE Priam Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW1.selectedIndex;
	if(ChoixEW == 0)
		{
		var Pri_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var Pri_Long_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Long_Sgn = parseFloat(Pri_Long_Signe);
	var Pri_Long_Deg = parseFloat(form.T_Long_Deg_P.value);
	var Pri_Long_Min = parseFloat(form.T_Long_Min_P.value);
	var Pri_Long_Sec = parseFloat(form.T_Long_Sec_P.value);

	/* Coordonnées LONGITUDE Priam (Lambda) Décimale calculée */
	var Pri_Long_Dec = Pri_Long_Sgn * ((Pri_Long_Deg) + (Pri_Long_Min / 60) + (Pri_Long_Sec / 3600));

	/* Coordonnées LATITUDE Priam Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! */
	var ChoixNS = form.selectNS1.selectedIndex;
	if(ChoixNS == 0)
		{
		var Pri_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var Pri_Lat_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Lat_Sgn = parseFloat(Pri_Lat_Signe);
	var Pri_Lat_Deg = parseFloat(form.T_Lat_Deg_P.value);
	var Pri_Lat_Min = parseFloat(form.T_Lat_Min_P.value);
	var Pri_Lat_Sec = parseFloat(form.T_Lat_Sec_P.value);

	/* Coordonnées LATITUDE Priam (Phi) Décimale calculée */
	var Pri_Lat_Dec = Pri_Lat_Sgn * ((Pri_Lat_Deg) + (Pri_Lat_Min / 60) + (Pri_Lat_Sec / 3600));

	/* Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur */
	var Hauteur = 0;

	/* Référence Méridien de Grennwich pas décalage d'un système à l'autre */

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'H' Origine (Hayford 1909 - ED50 Priam)
	/* Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) */
	var H_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Pri_Lat_Dec * (Math.PI / 180)),2))))

	/* Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) (H_X comme Hayford Z) */
	var H_X = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.cos(Pri_Long_Dec * (Math.PI / 180));

	/* Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) */
	var H_Y = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.sin(Pri_Long_Dec * (Math.PI / 180));

	/* Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) */
	var H_Z = (H_v * (1 - Hayford_e) + Hauteur) * Math.sin(Pri_Lat_Dec * (Math.PI / 180));

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'C' Destination (Clarke 1880 - NTF Lambet GeoConcept) */
	/* Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux */
	var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
	/* Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 */
	var Lambda_0 = 0;

	/* Variable C_X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) (C_X comme Clarke X) */
	var C_X = Tx + H_X * Math.cos(Lambda_0 * (Math.PI / 180)) + H_Y * Math.sin(Lambda_0 * (Math.PI / 180));

	/* Variable C_Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) (C_Y comme Clarke Y) */
	var C_Y = Ty - H_X * Math.sin(Lambda_0 * (Math.PI / 180)) + H_Y * Math.cos(Lambda_0 * (Math.PI / 180));

	/* Variable C_Z calculée en mètres Z'= Z + Tz (C_Z comme Clarke Z) */
	var C_Z = H_Z + Tz;

	/* Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat */
	var Re_1 = Math.sqrt(Math.pow(C_X,2) + (Math.pow(C_Y,2)));

     /* Partie Coordonnées géographiques sur l'ellipsoïde 'C' de destination - Clarke 1880 - Origine Greenwich */
	/* Longitude Lambda en degrés décimaux sur Clarke - Long_C_Dec = Atan(Y'/X')/(Pi/180) */
	var Long_C_Dec = Math.atan(C_Y / C_X) / (Math.PI / 180);

	/* Latitude Phi en degrés décimaux sur Clarke - Lat_C_Dec = difficile à énoncer calcul récurcif */
	var ecart = 1;
	var Phi = Pri_Lat_Dec / (180 * Math.PI);
	while (ecart > 0.0000000001)
		{
		Phi_1 = Math.atan((C_Z + Clarke_e * Math.sin(Phi) * Clarke_a / Math.sqrt(1 - Clarke_e * Math.pow(Math.sin(Phi),2))) / Re_1);
		ecart = Math.abs(Phi - Phi_1);
		Phi = Phi_1;
		}
	var Lat_C_Dec = Phi * (180 / Math.PI);

	/* Variable v en mètre sur Geoïde de destination - C_v = Clarke_a / (racine (1 - Clarke_e * (sin(Phi * 180/PI)^2) */
	var C_v = Clarke_a / (Math.sqrt(1 - (Clarke_e * Math.pow(Math.sin(Lat_C_Dec * (Math.PI / 180)),2))));

	/* Hauteur ellipsoïdale h_C en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde */
	/* Formule = h_C = Re / Cos(Phi) - v */
	var h_C = Re_1 / Math.cos(Lat_C_Dec*(Math.PI / 180)) - C_v;

     /* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (Long_C_Dec > 0)
		{
		var E_W_Long_C = "E";
		}
	else
		{
		var E_W_Long_C = "W";
		}
	Long_C_Dec = Math.abs(Long_C_Dec);
	var Deg_Long_C = Math.abs(Math.floor(Long_C_Dec));
	var Min_Long_C = Math.floor((Long_C_Dec - Deg_Long_C) * 60);
	var Sec_Long_C = Math.round(((Long_C_Dec - Deg_Long_C - Min_Long_C / 60) * 3600)*1000)/1000;
	
     /* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S */
	if (Lat_C_Dec > 0)
		{
		var N_S_Lat_C = "N";
		}
	else
		{
		var N_S_Lat_C = "S";
		}
	Lat_C_Dec = Math.abs(Lat_C_Dec);
	var Deg_Lat_C = Math.floor(Lat_C_Dec);
	var Min_Lat_C = Math.floor((Lat_C_Dec - Deg_Lat_C) * 60);
	var Sec_Lat_C = Math.round(((Lat_C_Dec - Deg_Lat_C - Min_Lat_C / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_G.value = Deg_Lat_C
	form.T_Lat_Min_G.value = Min_Lat_C
	form.T_Lat_Sec_G.value = Sec_Lat_C
	if (N_S_Lat_C == "N")
		{
		form.selectNS2.selectedIndex = 0
		}
	if (N_S_Lat_C == "S")
		{
		form.selectNS2.selectedIndex = 1
		}
	form.T_Long_Deg_G.value = Deg_Long_C
	form.T_Long_Min_G.value = Min_Long_C
	form.T_Long_Sec_G.value = Sec_Long_C
	if (E_W_Long_C == "E")
		{
		form.selectEW2.selectedIndex = 0
		}
	if (E_W_Long_C == "W")
		{
		form.selectEW2.selectedIndex = 1
		}
     
/* Fin de la fonction De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GeoConcept (NTF) Sexa - Clarke 1880 (1) */
	}

function Hayford_Iagrs(form)
/* De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GPS (WGS84) Sexa - Iagrs80--RGF93 mais WGS84 tout de même avec les constantes (2) */
	{
	/* Constantes Ellipsoïde Hayford PRIAM ED50 */
	var Hayford_a = 6378388.00;
	var Hayford_f = 297;
	var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);
	// la valeur e est en fait e au carré
	var Hayford_e = (Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2);

	/* Constantes Ellipsoïde Iagrs reporté GPS WGS84 */
	var Iagrs_a = 6378137;
	var Iagrs_f = 298.257223563;
	var Iagrs_b = Iagrs_a - (Iagrs_a / Iagrs_f);
	// la valeur e est en fait e au carré
	var Iagrs_e = (Math.pow(Iagrs_a,2) - Math.pow(Iagrs_b,2)) / Math.pow(Iagrs_a,2);

	/* Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 2 */
	var Tx = -84;
	var Ty = -97;
	var Tz = -117;

	/* Coordonnées LONGITUDE Priam Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW1.selectedIndex;
	if(ChoixEW == 0)
		{
		var Pri_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var Pri_Long_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Long_Sgn = parseFloat(Pri_Long_Signe);
	var Pri_Long_Deg = parseFloat(form.T_Long_Deg_P.value);
	var Pri_Long_Min = parseFloat(form.T_Long_Min_P.value);
	var Pri_Long_Sec = parseFloat(form.T_Long_Sec_P.value);

	/* Coordonnées LONGITUDE Priam (Lambda) Décimale calculée */
	var Pri_Long_Dec = Pri_Long_Sgn * ((Pri_Long_Deg) + (Pri_Long_Min / 60) + (Pri_Long_Sec / 3600));

	/* Coordonnées LATITUDE Priam Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! */
	var ChoixNS = form.selectNS1.selectedIndex;
	if(ChoixNS == 0)
		{
		var Pri_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var Pri_Lat_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Lat_Sgn = parseFloat(Pri_Lat_Signe);
	var Pri_Lat_Deg = parseFloat(form.T_Lat_Deg_P.value);
	var Pri_Lat_Min = parseFloat(form.T_Lat_Min_P.value);
	var Pri_Lat_Sec = parseFloat(form.T_Lat_Sec_P.value);

	/* Coordonnées LATITUDE Priam (Phi) Décimale calculée */
	var Pri_Lat_Dec = Pri_Lat_Sgn * ((Pri_Lat_Deg) + (Pri_Lat_Min / 60) + (Pri_Lat_Sec / 3600));

	/* Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur */
	var Hauteur = 0;

	/* Référence Méridien de Grennwich pas décalage d'un système à l'autre */

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'H' Origine (Hayford 1909 - ED50 Priam)
	/* Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) */
	var H_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Pri_Lat_Dec * (Math.PI / 180)),2))));

	/* Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) (H_X comme Hayford Z) */
	var H_X = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.cos(Pri_Long_Dec * (Math.PI / 180));

	/* Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) */
	var H_Y = (H_v + Hauteur) * Math.cos(Pri_Lat_Dec * (Math.PI / 180)) * Math.sin(Pri_Long_Dec * (Math.PI / 180));

	/* Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) */
	var H_Z = (H_v * (1 - Hayford_e) + Hauteur) * Math.sin(Pri_Lat_Dec * (Math.PI / 180));

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'I' Destination (Iagrs80 - WGS84 GPS) */
	/* Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux */
	var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
	/* Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 */
	var Lambda_0 = 0;

	/* Variable I_X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) (I_X comme Iagrs X) */
	var I_X = Tx + H_X * Math.cos(Lambda_0 * (Math.PI / 180)) + H_Y * Math.sin(Lambda_0 * (Math.PI / 180));

	/* Variable I_Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) (I_Y comme Iagrs Y) */
	var I_Y = Ty - H_X * Math.sin(Lambda_0 * (Math.PI / 180)) + H_Y * Math.cos(Lambda_0 * (Math.PI / 180));

	/* Variable I_Z calculée en mètres Z'= Z + Tz (I_Z comme Iagrs Z) */
	var I_Z = H_Z + Tz;

	/* Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat */
	var Re_1 = Math.sqrt(Math.pow(I_X,2) + (Math.pow(I_Y,2)));

     /* Partie Coordonnées géographiques sur l'ellipsoïde 'I' de destination - Iagrs80 - Origine Greenwich */
	/* Longitude Lambda en degrés décimaux sur Iagrs - Long_I_Dec = Atan(Y'/X')/(Pi/180) */
	var Long_I_Dec = Math.atan(I_Y / I_X) / (Math.PI / 180);

	/* Latitude Phi en degrés décimaux sur Iagrs - Lat_I_Dec = difficile à énoncer calcul récurcif */
	var ecart = 1;
	var Phi = Pri_Lat_Dec / (180 * Math.PI);
	while (ecart > 0.0000000001)
		{
		Phi_1 = Math.atan((I_Z + Iagrs_e * Math.sin(Phi) * Iagrs_a / Math.sqrt(1 - Iagrs_e * Math.pow(Math.sin(Phi),2))) / Re_1);
		ecart = Math.abs(Phi - Phi_1);
		Phi = Phi_1;
		}
	var Lat_I_Dec = Phi * (180 / Math.PI);

	/* Variable v en mètre sur Geoïde de destination - I_v = Iagrs_a / (racine (1 - Iagrs_e * (sin(Phi * 180/PI)^2) */
	var I_v = Iagrs_a / (Math.sqrt(1 - (Iagrs_e * Math.pow(Math.sin(Lat_I_Dec * (Math.PI / 180)),2))));

	/* Hauteur ellipsoïdale h_I en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde */
	/* Formule = h_I = Re / Cos(Phi) - v */
	var h_I = Re_1 / Math.cos(Lat_I_Dec*(Math.PI / 180)) - I_v;

     /* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (Long_I_Dec > 0)
		{
		var E_W_Long_I = "E";
		}
	else
		{
		var E_W_Long_I = "W";
		}
	Long_I_Dec = Math.abs(Long_I_Dec);
	var Deg_Long_I = Math.abs(Math.floor(Long_I_Dec));
	var Min_Long_I = Math.floor((Long_I_Dec - Deg_Long_I) * 60);
	var Sec_Long_I = Math.round(((Long_I_Dec - Deg_Long_I - Min_Long_I / 60) * 3600)*1000)/1000;
	
     /* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S */
	if (Lat_I_Dec > 0)
		{
		var N_S_Lat_I = "N";
		}
	else
		{
		var N_S_Lat_I = "S";
		}
	Lat_I_Dec = Math.abs(Lat_I_Dec);
	var Deg_Lat_I = Math.floor(Lat_I_Dec);
	var Min_Lat_I = Math.floor((Lat_I_Dec - Deg_Lat_I) * 60);
	var Sec_Lat_I = Math.round(((Lat_I_Dec - Deg_Lat_I - Min_Lat_I / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_W.value = Lat_I_Dec
	form.T_Lat_Min_W.value = 0
	form.T_Lat_Sec_W.value = 0
	if (N_S_Lat_I == "N")
		{
		form.selectNS3.selectedIndex = 0
		}
	if (N_S_Lat_I == "S")
		{
		form.selectNS3.selectedIndex = 1
		}
	form.T_Long_Deg_W.value = Long_I_Dec
	form.T_Long_Min_W.value = 0
	form.T_Long_Sec_W.value = 0
	if (E_W_Long_I == "E")
		{
		form.selectEW3.selectedIndex = 0
		}
	if (E_W_Long_I == "W")
		{
		form.selectEW3.selectedIndex = 1
		}
     
/* Fin de la fonction De PRIAM (ED50) - Hayford 1909 (3) -- VERS -- GPS (WGS84) Sexa - Iagrs80 (2) */
	}

function NTF_Lambert(form)
/* Fonction de conversion des valeurs sexagésimales NTF (géoconcept) en coordonnées Lambert II étendu */
	{
	/* Constantes Ellipsoïde Hayford 1909 */
	/* 1/2 grand axe de l ellipsoide en m */
	var Lamb_a = 6378249.2;
	/* 1/2 petit axe de l ellipsoide en m */
	var Lamb_b = 6356515;
	/* Latitude Parallèle d origine en degrés */
	var Lamb_Phi0 = 46.800;
	/* Longitude du méridien de Paris en degrés */
	var Lamb_Lambda0 = 2.596921296 / 200 * 180;
	/* Excentricité de l ellipsoide */
	var Lamb_e = (Math.sqrt(Math.pow(Lamb_a,2) - Math.pow(Lamb_b,2))) / Lamb_a;
	
	/* Recueil des longitude et latitude */
	/* Coordonnées LONGITUDE Geoconcept NTF (Si W -> -1 ou Si E -> 1) NTF_Deg, NTF_Min, NTF_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW2.selectedIndex;
	if(ChoixEW == 0)
		{
		var NTF_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var NTF_Long_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var NTF_Long_Sgn = parseFloat(NTF_Long_Signe);
	var NTF_Long_Deg = parseFloat(form.T_Long_Deg_G.value);
	var NTF_Long_Min = parseFloat(form.T_Long_Min_G.value);
	var NTF_Long_Sec = parseFloat(form.T_Long_Sec_G.value);

	/* Coordonnées LONGITUDE NTF (Lambda) Décimale calculée */
	var NTF_Long_Dec = NTF_Long_Sgn * ((NTF_Long_Deg) + (NTF_Long_Min / 60) + (NTF_Long_Sec / 3600));

	/* Coordonnées LATITUDE Geoconcept NTF (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* var NTF_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! */
	var ChoixNS = form.selectNS2.selectedIndex;
	if(ChoixNS == 0)
		{
		var NTF_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var NTF_Lat_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var NTF_Lat_Sgn = parseFloat(NTF_Lat_Signe);
	var NTF_Lat_Deg = parseFloat(form.T_Lat_Deg_G.value);
	var NTF_Lat_Min = parseFloat(form.T_Lat_Min_G.value);
	var NTF_Lat_Sec = parseFloat(form.T_Lat_Sec_G.value);

	/* Coordonnée LATITUDE NTF (Phi) Décimale calculée */
	var NTF_Lat_Dec = NTF_Lat_Sgn * ((NTF_Lat_Deg) + (NTF_Lat_Min / 60) + (NTF_Lat_Sec / 3600));
	/* Fin du Recueil des longitude et latitude */

	/* Variable Lamb_v en mètres - Rayon de courbure de l 'ellipse normale principale - Lamb_v = Lamb_a / (racine (1 - Lamb_e^2 * (sin(Phi * PI/180)^2)) */
	var Lamb_v = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (NTF_Lat_Dec * Math.PI / 180),2)));

	/* Latitude isométrique - Lamb_LatIso = Ln(tan(Pi/4+Phi/2))-e/2*Ln((1+e*sin(Phi))/(1-e*sin(Phi))) */
	var Lamb_LatIso = (Math.log(Math.tan((Math.PI / 4 + (NTF_Lat_Dec * Math.PI / 360))))) - Lamb_e / 2 * (Math.log((1 + Lamb_e * Math.sin(NTF_Lat_Dec * Math.PI /180))/(1-Lamb_e*Math.sin(NTF_Lat_Dec * Math.PI /180))));

	/* Latitude isométrique pour Lambda0 - Lamb_LatIso0 = Ln(tan(Pi/4+Phi0/2))-e/2*Ln((1+e*sin(Phi0))/(1-e*sin(Phi0))) */
	var Lamb_LatIso0 = (Math.log(Math.tan((Math.PI / 4 + (Lamb_Phi0 * Math.PI / 360))))) - Lamb_e / 2 * (Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI /180))/(1-Lamb_e*Math.sin(Lamb_Phi0 * Math.PI /180))));

	/* Convergence des méridiens Lamb_Gamma */
	if(NTF_Long_Dec < 180)
		{
		var Lamb_Gamma = (NTF_Long_Dec - Lamb_Lambda0) * Math.sin(Lamb_Phi0 * Math.PI / 180);
		}
	if(NTF_Long_Dec > 180)
		{
		var Lamb_Gamma = (NTF_Long_Dec - Lamb_Lambda0 - 360) * Math.sin(Lamb_Phi0 * Math.PI / 180);
		}

	/* Constantes de Zone Lambert II en Km */
	var Lamb_Ce = 600;
	var Lamb_Cn = 2200;
	
	/* Calcul des constantes pour la zone II de Lambert */
	var Lamb_v0 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi0 * Math.PI / 180),2)));
	var Lamb_R0 = Lamb_v0 / Math.tan(Lamb_Phi0 * Math.PI / 180);
	
	var Lamb_Phi1 = 50.99879884 / 200 * 180;
	var Lamb_Phi2 = 52.99557167 / 200 * 180;

	var Lamb_v01 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi1 * Math.PI / 180),2)));
	var Lamb_v02 = Lamb_a / (Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi2 * Math.PI / 180),2)));
	var Lamb_Ro01 = Lamb_a * (1 - Math.pow (Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi1 * Math.PI / 180),2))),3);
	var Lamb_Ro02 = Lamb_a * (1 - Math.pow (Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow (Lamb_e,2) * Math.pow(Math.sin (Lamb_Phi2 * Math.PI / 180),2))),3);
	var Lamb_m1 = 1 + Lamb_Ro01 / 2 / Lamb_v01 * Math.pow((Lamb_Phi1 - Lamb_Phi0) * Math.PI / 180,2);
	var Lamb_m2 = 1 + Lamb_Ro02 / 2 / Lamb_v02 * Math.pow((Lamb_Phi2 - Lamb_Phi0) * Math.PI / 180,2);
	var Lamb_m = (Lamb_m1 + Lamb_m2) / 2;
	var Lamb_mL = 2 - Lamb_m;

	/* Rayon du parallèle d origine après réduction d echelle en mètres */
	var Lamb_mLR0 = Lamb_mL * Lamb_R0;
	
	/* Rayon du parallèle passant par le point recherché en mètres */
	var Lamb_R = Lamb_mLR0 * Math.exp(- Math.sin(Lamb_Phi0 * Math.PI / 180) * (Lamb_LatIso - Lamb_LatIso0));

	/* Abscisse X1 dans le repère associé au méridien d origine et au parallèle d origine en mètres */
	var Lamb_E1 = Lamb_R * Math.sin(Lamb_Gamma * Math.PI / 180);

	/* Coordonnées Lambert II du point recherché en mètres */
	var Lamb_EE = Lamb_E1 + Lamb_Ce * 1000;
	var Lamb_NN = Lamb_mLR0 - Lamb_R + Lamb_E1 * Math.tan(Lamb_Gamma * Math.PI / 360) + Lamb_Cn * 1000;

	/* arrondissement des valeurs pour affichage 3 chiffres après la virgule */
	var Lamb_EE_Arr = Math.round(Lamb_EE * 1000) / 1000
	var Lamb_NN_Arr = Math.round(Lamb_NN * 1000) / 1000

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_X_Lamb.value = Lamb_EE_Arr;
	form.T_Y_Lamb.value = Lamb_NN_Arr;
/* Fin de la fonction de conversion des valeurs sexagésimales NTF (géoconcept) en coordonnées Lambert II étendu */
	}	



function ED50_UTM(form)
/* Fonction de conversion des valeurs sexagésimales ED50 en coordonnées Planes UTM */
	{
	/* Constantes Ellipsoïde Hayford ED50*/
	var UTM_a = 6378388.00;
	var UTM_f = 297;
	var UTM_b = UTM_a - (UTM_a / UTM_f);
	var UTM_e2 = (Math.pow(UTM_a,2) - Math.pow(UTM_b,2)) / Math.pow(UTM_a,2);
	var UTM_e = Math.sqrt(UTM_e2);
	
	/* Coordonnées LONGITUDE ED50 Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW1.selectedIndex;
	if(ChoixEW == 0)
		{
		var Pri_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var Pri_Long_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Long_Sgn = parseFloat(Pri_Long_Signe);
	var Pri_Long_Deg = parseFloat(form.T_Long_Deg_P.value);
	var Pri_Long_Min = parseFloat(form.T_Long_Min_P.value);
	var Pri_Long_Sec = parseFloat(form.T_Long_Sec_P.value);

	/* Coordonnées LONGITUDE ED50 (Lambda) Décimale calculée */
	var UTM_Lambda = Pri_Long_Sgn * ((Pri_Long_Deg) + (Pri_Long_Min / 60) + (Pri_Long_Sec / 3600));

	/* Coordonnées LATITUDE Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! */
	var ChoixNS = form.selectNS1.selectedIndex;
	if(ChoixNS == 0)
		{
		var Pri_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var Pri_Lat_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var Pri_Lat_Sgn = parseFloat(Pri_Lat_Signe);
	var Pri_Lat_Deg = parseFloat(form.T_Lat_Deg_P.value);
	var Pri_Lat_Min = parseFloat(form.T_Lat_Min_P.value);
	var Pri_Lat_Sec = parseFloat(form.T_Lat_Sec_P.value);

	/* Coordonnées LATITUDE (Phi) Décimale calculée */
	var UTM_Phi = Pri_Lat_Sgn * ((Pri_Lat_Deg) + (Pri_Lat_Min / 60) + (Pri_Lat_Sec / 3600));

	/* Fuseau UTM calculé en fonction de de UTM_Lambda */
	var UTM_Fus = Math.floor((UTM_Lambda + 186) / 6);
		
	/* Constantes de la projection UTM */
	/* Constante Module Linéaire */
	var UTM_Mod_Lin = 0.9996;
	/* Constantes de projection UTM NORD */
	if(UTM_Phi >= 0)
		{
		/* Rayon de la sphère intermédiaire en mètres */
		var UTM_n = UTM_a * UTM_Mod_Lin;
		/* Longitude d origine par rapport au méridien Greenwich et fuseau calculé en degré*/
		var UTM_Lambda_c = 6 * UTM_Fus - 183;
		/* Constante EST en mètres*/
		var UTM_Ce = 500000;
		/* Constante NORD en mètres*/
		var UTM_Cn = 0;
		}
	/* Constantes de projection UTM SUD */
	if(UTM_Phi < 0)
		{
		/* Rayon de la sphère intermédiaire en mètres */
		var UTM_n = UTM_b * UTM_Mod_Lin;
		/* Longitude d origine par rapport au méridien Greenwich et fuseau calculé en degré*/
		var UTM_Lambda_c = 6 * UTM_Fus - 183;
		/* Constante EST en mètres*/
		var UTM_Ce = 500000;
		/* Constante NORD en mètres*/
		var UTM_Cn = 10000000;
		}

	/* Coefficients de projection en fonction de l excentricité Hayford 1909 */
	var UTM_C1 = 1 - UTM_e2 / 4 - 3 * Math.pow(UTM_e2,2) / 64 - 5 * Math.pow(UTM_e2,3) / 256 - 175 * Math.pow(UTM_e2,4) / 16384;
	var UTM_C2 = UTM_e2 / 8 - Math.pow(UTM_e2,2) / 96 - 9 * Math.pow(UTM_e2,3) / 1024 - 901 * Math.pow(UTM_e2,4) / 184320;
	var UTM_C3 = 13 * Math.pow(UTM_e2,2) / 768 + 17 * Math.pow(UTM_e2,3) / 5120 - 311 * Math.pow(UTM_e2,4) / 737280;
	var UTM_C4 = 61 / 15360 * Math.pow(UTM_e2,3) + 899 / 430080 * Math.pow(UTM_e2,4);
	var UTM_C5 = 49561 / 41287680 * Math.pow(UTM_e2,4);

	/* Latitude isométrique */
	var UTM_Lat_Iso = Math.log(Math.tan(Math.PI / 4 + UTM_Phi * Math.PI / 360)) - UTM_e / 2 * Math.log((1 + UTM_e * Math.sin(UTM_Phi * Math.PI / 180)) / (1 - UTM_e * Math.sin(UTM_Phi * Math.PI / 180)));
	/* Latitude Sphérique - précision Sinh et cosh inexistants en javascript décomposé en ((exp(x) +- exp(-x))/2 */
	var UTM_Lat_Sph = Math.asin((Math.sin((UTM_Lambda - UTM_Lambda_c) / 180 * Math.PI)) / ((Math.exp(UTM_Lat_Iso) + Math.exp(UTM_Lat_Iso * -1)) / 2));
	/* Latitude isométrique sur la sphère intermédiaire */
	var UTM_Iso_In = Math.log(Math.tan(Math.PI / 4 + UTM_Lat_Sph / 2));
	
	/* Nombre complexe intermédiaire z = (Lambda_Maj + i * Lat_Iso_In) */
	/* Partie réelle UTM_Lam_Maj (Lambda_Maj) */
	var UTM_Lam_Maj = Math.atan(((Math.exp(UTM_Lat_Iso) - Math.exp(UTM_Lat_Iso * -1)) / 2) / (Math.cos((UTM_Lambda - UTM_Lambda_c) / 180 * Math.PI)));
	/* Partie imaginaire = UTM_Iso_In */
	/* Complexe final Z = n * C1 * z + n * somme Cj * sin(2*j*x) */
	/* Partie imaginaire E1 décomposé longue ligne sinon... */
	var UTM_E1_1 = UTM_C1 * UTM_Iso_In;
	var UTM_E1_2 = UTM_C2 * Math.cos(2 * UTM_Lam_Maj) * ((Math.exp(2 * UTM_Iso_In) - Math.exp(2 * UTM_Iso_In * -1)) / 2);
	var UTM_E1_3 = UTM_C3 * Math.cos(4 * UTM_Lam_Maj) * ((Math.exp(4 * UTM_Iso_In) - Math.exp(4 * UTM_Iso_In * -1)) / 2);
	var UTM_E1_4 = UTM_C4 * Math.cos(6 * UTM_Lam_Maj) * ((Math.exp(6 * UTM_Iso_In) - Math.exp(6 * UTM_Iso_In * -1)) / 2);
	var UTM_E1_5 = UTM_C5 * Math.cos(8 * UTM_Lam_Maj) * ((Math.exp(8 * UTM_Iso_In) - Math.exp(8 * UTM_Iso_In * -1)) / 2);
	var UTM_E1 = UTM_n * (UTM_E1_1 + UTM_E1_2 + UTM_E1_3 + UTM_E1_4 + UTM_E1_5);
	/* Partie réelle N1 décomposé aussi */
	var UTM_N1_1 = UTM_C1 * UTM_Lam_Maj;
	var UTM_N1_2 = UTM_C2 * Math.sin(2 * UTM_Lam_Maj) * ((Math.exp(2 * UTM_Iso_In) + Math.exp(2 * UTM_Iso_In * -1)) / 2);
	var UTM_N1_3 = UTM_C3 * Math.sin(4 * UTM_Lam_Maj) * ((Math.exp(4 * UTM_Iso_In) + Math.exp(4 * UTM_Iso_In * -1)) / 2);
	var UTM_N1_4 = UTM_C4 * Math.sin(6 * UTM_Lam_Maj) * ((Math.exp(6 * UTM_Iso_In) + Math.exp(6 * UTM_Iso_In * -1)) / 2);
	var UTM_N1_5 = UTM_C5 * Math.sin(8 * UTM_Lam_Maj) * ((Math.exp(8 * UTM_Iso_In) + Math.exp(8 * UTM_Iso_In * -1)) / 2);
	var UTM_N1 = UTM_n * (UTM_N1_1 + UTM_N1_2 + UTM_N1_3 + UTM_N1_4 + UTM_N1_5);
	
	/* Coordonnées finales UTM en mètres EE point à partir bord ouest du fuseau - NN point à partir de l équateur*/
	var UTM_EE = UTM_E1 + UTM_Ce;
	var UTM_NN = UTM_N1 + UTM_Cn;

/*TESTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz*/
//	alert("Valeur E sens ED50 vers UTM " + UTM_EE);
//	alert("Valeur N sens ED50 vers UTM " + UTM_NN);
/*TESTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz*/
	
	/* Recherche de la lettre caractérisant la bande - 20 bandes de 8 degrés sauf N et S où Equateur sépare M et N*/
	/* Bandes NORD */
	if(UTM_Phi >= 0)
		{
		/* Déclaration du tableau des lettres en fonction de la bande */
		Bande = new Array(11);
		Bande[0] = "ERR";
		Bande[1] = "N";
		Bande[2] = "P";
		Bande[3] = "Q";
		Bande[4] = "R";
		Bande[5] = "S";
		Bande[6] = "T";
		Bande[7] = "U";
		Bande[8] = "V";
		Bande[9] = "W";
		Bande[10] = "X";
		/* calcul de la bande */
		var Num_Bande = Math.floor(Math.abs(UTM_Phi / 8)) + 1;
		var UTM_Bande = Bande[Num_Bande];
		}
	/* Bandes SUD */
	if(UTM_Phi < 0)
		{
		/* Déclaration du tableau des lettres en fonction de la bande */
		Bande = new Array(11);
		Bande[0] = "ERR";
		Bande[1] = "M";
		Bande[2] = "L";
		Bande[3] = "K";
		Bande[4] = "J";
		Bande[5] = "H";
		Bande[6] = "G";
		Bande[7] = "F";
		Bande[8] = "E";
		Bande[9] = "D";
		Bande[10] = "C";
		/* calcul de la bande */
		var Num_Bande = Math.floor(Math.abs(UTM_Phi / 8)) + 1;
		var UTM_Bande = Bande[Num_Bande];
		}

	/* Recherche du binôme XY où X longitude et Y latitude du carré de 100km de côté */
	/* Trouver Y dépend du fuseau pair (commence par F) ou impair (commence par A) sur 20 lettres à partir de l'équateur */
	if((UTM_Fus / 2 - Math.floor(UTM_Fus/2)) == 0)
		{
		/* Fuseau PAIR - Déclaration tableau séquence lettres à partir de l équateur */
		Lettre_Y = new Array(21);
		Lettre_Y[0] = "ERR";
		Lettre_Y[1] = "F";
		Lettre_Y[2] = "G";
		Lettre_Y[3] = "H";
		Lettre_Y[4] = "J";
		Lettre_Y[5] = "K";
		Lettre_Y[6] = "L";
		Lettre_Y[7] = "M";
		Lettre_Y[8] = "N";
		Lettre_Y[9] = "P";
		Lettre_Y[10] = "Q";
		Lettre_Y[11] = "R";
		Lettre_Y[12] = "S";
		Lettre_Y[13] = "T";
		Lettre_Y[14] = "U";
		Lettre_Y[15] = "V";
		Lettre_Y[16] = "A";
		Lettre_Y[17] = "B";
		Lettre_Y[18] = "C";
		Lettre_Y[19] = "D";
		Lettre_Y[20] = "E";
		/* Nombre de carreaux à partir de l'équateur */
		var Nb_Tot_Carreaux = Math.floor(UTM_NN / 100000);
		/* Nombre de séquences complète de 20 caractères */
		var Nb_Sequ = Math.floor(Nb_Tot_Carreaux / 20);
		/* Longueur à défalquer */
		var Long_Defalq = 20 * Nb_Sequ * 100000;
		/* Reste caractérisant la position de la première lettre */
		var Reste_A = UTM_NN - Long_Defalq;
		/* Nombre de careeaux restant - détermine le carré de 100km lettre Y (+ 1 celui dans lequel se trouve le point)*/
		Nb_Carr_Rest = Math.floor(Reste_A / 100000);
		UTM_Let_Y = Lettre_Y[Nb_Carr_Rest + 1];
		/* Position verticale à l'intérieur du carré de 100km arrondi à la dizaine de cm*/
		UTM_Y = Math.round((Reste_A - (Nb_Carr_Rest * 100000))*10) / 10
		}
	
	
	if((UTM_Fus / 2 - Math.floor(UTM_Fus/2)) != 0)
		{
		/* Fuseau IMPAIR - Déclaration tableau séquence lettres à partir de l équateur */
		Lettre_Y = new Array(21);
		Lettre_Y[0] = "ERR";
		Lettre_Y[1] = "A";
		Lettre_Y[2] = "B";
		Lettre_Y[3] = "C";
		Lettre_Y[4] = "D";
		Lettre_Y[5] = "E";
		Lettre_Y[6] = "F";
		Lettre_Y[7] = "G";
		Lettre_Y[8] = "H";
		Lettre_Y[9] = "J";
		Lettre_Y[10] = "K";
		Lettre_Y[11] = "L";
		Lettre_Y[12] = "M";
		Lettre_Y[13] = "N";
		Lettre_Y[14] = "P";
		Lettre_Y[15] = "Q";
		Lettre_Y[16] = "R";
		Lettre_Y[17] = "S";
		Lettre_Y[18] = "T";
		Lettre_Y[19] = "U";
		Lettre_Y[20] = "V";
		/* Nombre de carreaux à partir de l'équateur */
		var Nb_Tot_Carreaux = Math.floor(UTM_NN / 100000);
		/* Nombre de séquences complète de 20 caractères */
		var Nb_Sequ = Math.floor(Nb_Tot_Carreaux / 20);
		/* Longueur à défalquer */
		var Long_Defalq = 20 * Nb_Sequ * 100000;
		/* Reste caractérisant la position de la première lettre */
		var Reste_A = UTM_NN - Long_Defalq;
		/* Nombre de carreaux restant - détermine le carré de 100km lettre Y (+ 1 celui dans lequel se trouve le point)*/
		var Nb_Carr_Rest = Math.floor(Reste_A / 100000);
		var UTM_Let_Y = Lettre_Y[Nb_Carr_Rest + 1];
		/* Position verticale à l'intérieur du carré de 100km arrondi à la dizaine de cm*/
		var UTM_Y = Math.round((Reste_A - (Nb_Carr_Rest * 100000))*100) / 100
		}
	
	/* Trouver X dépend de la valeur UTM_EE et du fuseau UTM_Fus- récursivité tous les 18 degrés - les carrés de l'équateur vers le Nord diminuent jusqu à disparaitre*/	
	/* Position entre 166 et 200 km à partir du bord Ouest du fuseau */
	if(UTM_EE < 200000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "A";
		Lettre_X[2] = "J";
		Lettre_X[3] = "S";
		Lettre_X[4] = "A";
		Lettre_X[5] = "J";
		Lettre_X[6] = "S";
		Lettre_X[7] = "A";
		Lettre_X[8] = "J";
		Lettre_X[9] = "S";
		Lettre_X[10] = "A";
		Lettre_X[11] = "J";
		Lettre_X[12] = "S";
		Lettre_X[13] = "A";
		Lettre_X[14] = "J";
		Lettre_X[15] = "S";
		Lettre_X[16] = "A";
		Lettre_X[17] = "J";
		Lettre_X[18] = "S";
		Lettre_X[19] = "A";
		Lettre_X[20] = "J";
		Lettre_X[21] = "S";
		Lettre_X[22] = "A";
		Lettre_X[23] = "J";
		Lettre_X[24] = "S";
		Lettre_X[25] = "A";
		Lettre_X[26] = "J";
		Lettre_X[27] = "S";
		Lettre_X[28] = "A";
		Lettre_X[29] = "J";
		Lettre_X[30] = "S";
		Lettre_X[31] = "A";
		Lettre_X[32] = "J";
		Lettre_X[33] = "S";
		Lettre_X[34] = "A";
		Lettre_X[35] = "J";
		Lettre_X[36] = "S";
		Lettre_X[37] = "A";
		Lettre_X[38] = "J";
		Lettre_X[39] = "S";
		Lettre_X[40] = "A";
		Lettre_X[41] = "J";
		Lettre_X[42] = "S";
		Lettre_X[43] = "A";
		Lettre_X[44] = "J";
		Lettre_X[45] = "S";
		Lettre_X[46] = "A";
		Lettre_X[47] = "J";
		Lettre_X[48] = "S";
		Lettre_X[49] = "A";
		Lettre_X[50] = "J";
		Lettre_X[51] = "S";
		Lettre_X[52] = "A";
		Lettre_X[53] = "J";
		Lettre_X[54] = "S";
		Lettre_X[55] = "A";
		Lettre_X[56] = "J";
		Lettre_X[57] = "S";
		Lettre_X[58] = "A";
		Lettre_X[59] = "J";
		Lettre_X[60] = "S";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 166000)*100) / 100;
		}
		
	/* Position entre 200 et 300 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 200000 && UTM_EE < 300000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "B";
		Lettre_X[2] = "K";
		Lettre_X[3] = "T";
		Lettre_X[4] = "B";
		Lettre_X[5] = "K";
		Lettre_X[6] = "T";
		Lettre_X[7] = "B";
		Lettre_X[8] = "K";
		Lettre_X[9] = "T";
		Lettre_X[10] = "B";
		Lettre_X[11] = "K";
		Lettre_X[12] = "T";
		Lettre_X[13] = "B";
		Lettre_X[14] = "K";
		Lettre_X[15] = "T";
		Lettre_X[16] = "B";
		Lettre_X[17] = "K";
		Lettre_X[18] = "T";
		Lettre_X[19] = "B";
		Lettre_X[20] = "K";
		Lettre_X[21] = "T";
		Lettre_X[22] = "B";
		Lettre_X[23] = "K";
		Lettre_X[24] = "T";
		Lettre_X[25] = "B";
		Lettre_X[26] = "K";
		Lettre_X[27] = "T";
		Lettre_X[28] = "B";
		Lettre_X[29] = "K";
		Lettre_X[30] = "T";
		Lettre_X[31] = "B";
		Lettre_X[32] = "K";
		Lettre_X[33] = "T";
		Lettre_X[34] = "B";
		Lettre_X[35] = "K";
		Lettre_X[36] = "T";
		Lettre_X[37] = "B";
		Lettre_X[38] = "K";
		Lettre_X[39] = "T";
		Lettre_X[40] = "B";
		Lettre_X[41] = "K";
		Lettre_X[42] = "T";
		Lettre_X[43] = "B";
		Lettre_X[44] = "K";
		Lettre_X[45] = "T";
		Lettre_X[46] = "B";
		Lettre_X[47] = "K";
		Lettre_X[48] = "T";
		Lettre_X[49] = "B";
		Lettre_X[50] = "K";
		Lettre_X[51] = "T";
		Lettre_X[52] = "B";
		Lettre_X[53] = "K";
		Lettre_X[54] = "T";
		Lettre_X[55] = "B";
		Lettre_X[56] = "K";
		Lettre_X[57] = "T";
		Lettre_X[58] = "B";
		Lettre_X[59] = "K";
		Lettre_X[60] = "T";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 200000)*100) / 100;
		}
	
	/* Position entre 300 et 400 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 300000 && UTM_EE < 400000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "C";
		Lettre_X[2] = "L";
		Lettre_X[3] = "U";
		Lettre_X[4] = "C";
		Lettre_X[5] = "L";
		Lettre_X[6] = "U";
		Lettre_X[7] = "C";
		Lettre_X[8] = "L";
		Lettre_X[9] = "U";
		Lettre_X[10] = "C";
		Lettre_X[11] = "L";
		Lettre_X[12] = "U";
		Lettre_X[13] = "C";
		Lettre_X[14] = "L";
		Lettre_X[15] = "U";
		Lettre_X[16] = "C";
		Lettre_X[17] = "L";
		Lettre_X[18] = "U";
		Lettre_X[19] = "C";
		Lettre_X[20] = "L";
		Lettre_X[21] = "U";
		Lettre_X[22] = "C";
		Lettre_X[23] = "L";
		Lettre_X[24] = "U";
		Lettre_X[25] = "C";
		Lettre_X[26] = "L";
		Lettre_X[27] = "U";
		Lettre_X[28] = "C";
		Lettre_X[29] = "L";
		Lettre_X[30] = "U";
		Lettre_X[31] = "C";
		Lettre_X[32] = "L";
		Lettre_X[33] = "U";
		Lettre_X[34] = "C";
		Lettre_X[35] = "L";
		Lettre_X[36] = "U";
		Lettre_X[37] = "C";
		Lettre_X[38] = "L";
		Lettre_X[39] = "U";
		Lettre_X[40] = "C";
		Lettre_X[41] = "L";
		Lettre_X[42] = "U";
		Lettre_X[43] = "C";
		Lettre_X[44] = "L";
		Lettre_X[45] = "U";
		Lettre_X[46] = "C";
		Lettre_X[47] = "L";
		Lettre_X[48] = "U";
		Lettre_X[49] = "C";
		Lettre_X[50] = "L";
		Lettre_X[51] = "U";
		Lettre_X[52] = "C";
		Lettre_X[53] = "L";
		Lettre_X[54] = "U";
		Lettre_X[55] = "C";
		Lettre_X[56] = "L";
		Lettre_X[57] = "U";
		Lettre_X[58] = "C";
		Lettre_X[59] = "L";
		Lettre_X[60] = "U";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 300000)*100) / 100;
		}	
	
	/* Position entre 400 et 500 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 400000 && UTM_EE < 500000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "D";
		Lettre_X[2] = "M";
		Lettre_X[3] = "V";
		Lettre_X[4] = "D";
		Lettre_X[5] = "M";
		Lettre_X[6] = "V";
		Lettre_X[7] = "D";
		Lettre_X[8] = "M";
		Lettre_X[9] = "V";
		Lettre_X[10] = "D";
		Lettre_X[11] = "M";
		Lettre_X[12] = "V";
		Lettre_X[13] = "D";
		Lettre_X[14] = "M";
		Lettre_X[15] = "V";
		Lettre_X[16] = "D";
		Lettre_X[17] = "M";
		Lettre_X[18] = "V";
		Lettre_X[19] = "D";
		Lettre_X[20] = "M";
		Lettre_X[21] = "V";
		Lettre_X[22] = "D";
		Lettre_X[23] = "M";
		Lettre_X[24] = "V";
		Lettre_X[25] = "D";
		Lettre_X[26] = "M";
		Lettre_X[27] = "V";
		Lettre_X[28] = "D";
		Lettre_X[29] = "M";
		Lettre_X[30] = "V";
		Lettre_X[31] = "D";
		Lettre_X[32] = "M";
		Lettre_X[33] = "V";
		Lettre_X[34] = "D";
		Lettre_X[35] = "M";
		Lettre_X[36] = "V";
		Lettre_X[37] = "D";
		Lettre_X[38] = "M";
		Lettre_X[39] = "V";
		Lettre_X[40] = "D";
		Lettre_X[41] = "M";
		Lettre_X[42] = "V";
		Lettre_X[43] = "D";
		Lettre_X[44] = "M";
		Lettre_X[45] = "V";
		Lettre_X[46] = "D";
		Lettre_X[47] = "M";
		Lettre_X[48] = "V";
		Lettre_X[49] = "D";
		Lettre_X[50] = "M";
		Lettre_X[51] = "V";
		Lettre_X[52] = "D";
		Lettre_X[53] = "M";
		Lettre_X[54] = "V";
		Lettre_X[55] = "D";
		Lettre_X[56] = "M";
		Lettre_X[57] = "V";
		Lettre_X[58] = "D";
		Lettre_X[59] = "M";
		Lettre_X[60] = "V";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 400000)*100) / 100;
		}		
	
	/* Position entre 500 et 600 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 500000 && UTM_EE < 600000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "E";
		Lettre_X[2] = "N";
		Lettre_X[3] = "W";
		Lettre_X[4] = "E";
		Lettre_X[5] = "N";
		Lettre_X[6] = "W";
		Lettre_X[7] = "E";
		Lettre_X[8] = "N";
		Lettre_X[9] = "W";
		Lettre_X[10] = "E";
		Lettre_X[11] = "N";
		Lettre_X[12] = "W";
		Lettre_X[13] = "E";
		Lettre_X[14] = "N";
		Lettre_X[15] = "W";
		Lettre_X[16] = "E";
		Lettre_X[17] = "N";
		Lettre_X[18] = "W";
		Lettre_X[19] = "E";
		Lettre_X[20] = "N";
		Lettre_X[21] = "W";
		Lettre_X[22] = "E";
		Lettre_X[23] = "N";
		Lettre_X[24] = "W";
		Lettre_X[25] = "E";
		Lettre_X[26] = "N";
		Lettre_X[27] = "W";
		Lettre_X[28] = "E";
		Lettre_X[29] = "N";
		Lettre_X[30] = "W";
		Lettre_X[31] = "E";
		Lettre_X[32] = "N";
		Lettre_X[33] = "W";
		Lettre_X[34] = "E";
		Lettre_X[35] = "N";
		Lettre_X[36] = "W";
		Lettre_X[37] = "E";
		Lettre_X[38] = "N";
		Lettre_X[39] = "W";
		Lettre_X[40] = "E";
		Lettre_X[41] = "N";
		Lettre_X[42] = "W";
		Lettre_X[43] = "E";
		Lettre_X[44] = "N";
		Lettre_X[45] = "W";
		Lettre_X[46] = "E";
		Lettre_X[47] = "N";
		Lettre_X[48] = "W";
		Lettre_X[49] = "E";
		Lettre_X[50] = "N";
		Lettre_X[51] = "W";
		Lettre_X[52] = "E";
		Lettre_X[53] = "N";
		Lettre_X[54] = "W";
		Lettre_X[55] = "E";
		Lettre_X[56] = "N";
		Lettre_X[57] = "W";
		Lettre_X[58] = "E";
		Lettre_X[59] = "N";
		Lettre_X[60] = "W";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 500000)*100) / 100;
		}		
	
	/* Position entre 600 et 700 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 600000 && UTM_EE < 700000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "F";
		Lettre_X[2] = "P";
		Lettre_X[3] = "X";
		Lettre_X[4] = "F";
		Lettre_X[5] = "P";
		Lettre_X[6] = "X";
		Lettre_X[7] = "F";
		Lettre_X[8] = "P";
		Lettre_X[9] = "X";
		Lettre_X[10] = "F";
		Lettre_X[11] = "P";
		Lettre_X[12] = "X";
		Lettre_X[13] = "F";
		Lettre_X[14] = "P";
		Lettre_X[15] = "X";
		Lettre_X[16] = "F";
		Lettre_X[17] = "P";
		Lettre_X[18] = "X";
		Lettre_X[19] = "F";
		Lettre_X[20] = "P";
		Lettre_X[21] = "X";
		Lettre_X[22] = "F";
		Lettre_X[23] = "P";
		Lettre_X[24] = "X";
		Lettre_X[25] = "F";
		Lettre_X[26] = "P";
		Lettre_X[27] = "X";
		Lettre_X[28] = "F";
		Lettre_X[29] = "P";
		Lettre_X[30] = "X";
		Lettre_X[31] = "F";
		Lettre_X[32] = "P";
		Lettre_X[33] = "X";
		Lettre_X[34] = "F";
		Lettre_X[35] = "P";
		Lettre_X[36] = "X";
		Lettre_X[37] = "F";
		Lettre_X[38] = "P";
		Lettre_X[39] = "X";
		Lettre_X[40] = "F";
		Lettre_X[41] = "P";
		Lettre_X[42] = "X";
		Lettre_X[43] = "F";
		Lettre_X[44] = "P";
		Lettre_X[45] = "X";
		Lettre_X[46] = "F";
		Lettre_X[47] = "P";
		Lettre_X[48] = "X";
		Lettre_X[49] = "F";
		Lettre_X[50] = "P";
		Lettre_X[51] = "X";
		Lettre_X[52] = "F";
		Lettre_X[53] = "P";
		Lettre_X[54] = "X";
		Lettre_X[55] = "F";
		Lettre_X[56] = "P";
		Lettre_X[57] = "X";
		Lettre_X[58] = "F";
		Lettre_X[59] = "P";
		Lettre_X[60] = "X";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 600000)*100) / 100;
		}		

	/* Position entre 700 et 800 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 700000 && UTM_EE < 800000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "G";
		Lettre_X[2] = "Q";
		Lettre_X[3] = "Y";
		Lettre_X[4] = "G";
		Lettre_X[5] = "Q";
		Lettre_X[6] = "Y";
		Lettre_X[7] = "G";
		Lettre_X[8] = "Q";
		Lettre_X[9] = "Y";
		Lettre_X[10] = "G";
		Lettre_X[11] = "Q";
		Lettre_X[12] = "Y";
		Lettre_X[13] = "G";
		Lettre_X[14] = "Q";
		Lettre_X[15] = "Y";
		Lettre_X[16] = "G";
		Lettre_X[17] = "Q";
		Lettre_X[18] = "Y";
		Lettre_X[19] = "G";
		Lettre_X[20] = "Q";
		Lettre_X[21] = "Y";
		Lettre_X[22] = "G";
		Lettre_X[23] = "Q";
		Lettre_X[24] = "Y";
		Lettre_X[25] = "G";
		Lettre_X[26] = "Q";
		Lettre_X[27] = "Y";
		Lettre_X[28] = "G";
		Lettre_X[29] = "Q";
		Lettre_X[30] = "Y";
		Lettre_X[31] = "G";
		Lettre_X[32] = "Q";
		Lettre_X[33] = "Y";
		Lettre_X[34] = "G";
		Lettre_X[35] = "Q";
		Lettre_X[36] = "Y";
		Lettre_X[37] = "G";
		Lettre_X[38] = "Q";
		Lettre_X[39] = "Y";
		Lettre_X[40] = "G";
		Lettre_X[41] = "Q";
		Lettre_X[42] = "Y";
		Lettre_X[43] = "G";
		Lettre_X[44] = "Q";
		Lettre_X[45] = "Y";
		Lettre_X[46] = "G";
		Lettre_X[47] = "Q";
		Lettre_X[48] = "Y";
		Lettre_X[49] = "G";
		Lettre_X[50] = "Q";
		Lettre_X[51] = "Y";
		Lettre_X[52] = "G";
		Lettre_X[53] = "Q";
		Lettre_X[54] = "Y";
		Lettre_X[55] = "G";
		Lettre_X[56] = "Q";
		Lettre_X[57] = "Y";
		Lettre_X[58] = "G";
		Lettre_X[59] = "Q";
		Lettre_X[60] = "Y";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 700000)*100) / 100;
		}		

	/* Position entre 800 et 833 km à partir du bord Ouest du fuseau */
	if(UTM_EE >= 800000)
		{
		/* Déclaration tableau de séquence de lettres récursives */
		Lettre_X = new Array(61);
		Lettre_X[0] = "ERR";
		Lettre_X[1] = "H";
		Lettre_X[2] = "R";
		Lettre_X[3] = "Z";
		Lettre_X[4] = "H";
		Lettre_X[5] = "R";
		Lettre_X[6] = "Z";
		Lettre_X[7] = "H";
		Lettre_X[8] = "R";
		Lettre_X[9] = "Z";
		Lettre_X[10] = "H";
		Lettre_X[11] = "R";
		Lettre_X[12] = "Z";
		Lettre_X[13] = "H";
		Lettre_X[14] = "R";
		Lettre_X[15] = "Z";
		Lettre_X[16] = "H";
		Lettre_X[17] = "R";
		Lettre_X[18] = "Z";
		Lettre_X[19] = "H";
		Lettre_X[20] = "R";
		Lettre_X[21] = "Z";
		Lettre_X[22] = "H";
		Lettre_X[23] = "R";
		Lettre_X[24] = "Z";
		Lettre_X[25] = "H";
		Lettre_X[26] = "R";
		Lettre_X[27] = "Z";
		Lettre_X[28] = "H";
		Lettre_X[29] = "R";
		Lettre_X[30] = "Z";
		Lettre_X[31] = "H";
		Lettre_X[32] = "R";
		Lettre_X[33] = "Z";
		Lettre_X[34] = "H";
		Lettre_X[35] = "R";
		Lettre_X[36] = "Z";
		Lettre_X[37] = "H";
		Lettre_X[38] = "R";
		Lettre_X[39] = "Z";
		Lettre_X[40] = "H";
		Lettre_X[41] = "R";
		Lettre_X[42] = "Z";
		Lettre_X[43] = "H";
		Lettre_X[44] = "R";
		Lettre_X[45] = "Z";
		Lettre_X[46] = "H";
		Lettre_X[47] = "R";
		Lettre_X[48] = "Z";
		Lettre_X[49] = "H";
		Lettre_X[50] = "R";
		Lettre_X[51] = "Z";
		Lettre_X[52] = "H";
		Lettre_X[53] = "R";
		Lettre_X[54] = "Z";
		Lettre_X[55] = "H";
		Lettre_X[56] = "R";
		Lettre_X[57] = "Z";
		Lettre_X[58] = "H";
		Lettre_X[59] = "R";
		Lettre_X[60] = "Z";
		var UTM_Let_X = Lettre_X[UTM_Fus];
		var UTM_X = Math.round((UTM_EE - 800000)*100) / 100;
		}			
	var UTM_Let_XY = UTM_Let_X + UTM_Let_Y;
	
	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Fus_UTM.value = UTM_Fus;
	form.T_Ban_UTM.value = UTM_Bande;
	form.T_Zon_UTM.value = UTM_Let_XY;
	form.T_X_UTM.value = UTM_X;
	form.T_Y_UTM.value = UTM_Y;
/* Fin de Fonction de conversion des valeurs sexagésimales ED50 en coordonnées Planes UTM */	
	}

function UTM_ED50(form)
/* Fonction de conversion des valeurs coordonnées Planes en UTM sexagésimales ED50 */
	{
	/* Lecture des champs contenus dans le bloc UTM */
	var UTM_Fus = parseFloat(form.T_Fus_UTM.value);
	/* Voir à controler la valeur 1 positive 2 inférieure ou égale à 60 */
	var UTM_Bande = form.T_Ban_UTM.value;
	/* Passage du caractère de la bande en majuscule s il ne l est pas */
	UTM_Bande = UTM_Bande.toUpperCase();
	form.T_Ban_UTM.value = UTM_Bande;
	var UTM_Zone = form.T_Zon_UTM.value;
	/* Passage du Bigramme de la zone en majuscule s il ne l est pas */
	UTM_Zone = UTM_Zone.toUpperCase();
	form.T_Zon_UTM.value = UTM_Zone;
	var UTM_X = parseFloat(form.T_X_UTM.value);
	if(UTM_X >= 100000)
		{
		alert("La valeur X dépasse 100 000 mètres !");
		form.T_X_UTM.focus();
		return;
		}
	var UTM_Y = parseFloat(form.T_Y_UTM.value);
	if(UTM_Y >= 100000)
		{
		alert("La valeur Y dépasse 100 000 mètres !");
		form.T_Y_UTM.focus();
		return;
		}
	/* Déterminer si le Fuseau est Pair (1) ou Non (0)*/
	if((UTM_Fus / 2 - Math.floor(UTM_Fus/2)) == 0)
		{
		var UTM_Fus_Pair = 1;
		}
	if((UTM_Fus / 2 - Math.floor(UTM_Fus/2)) != 0)
		{
		var UTM_Fus_Pair = 0;
		}
	/* Déterminer si Nord ou Sud */
	if(UTM_Bande == "N" || UTM_Bande == "P" || UTM_Bande == "Q" || UTM_Bande == "R" || UTM_Bande == "S" || UTM_Bande == "T" || UTM_Bande == "U" || UTM_Bande == "V" || UTM_Bande == "W" || UTM_Bande == "X")
		{
		var UTM_Emisph = "N";
		}
		else if(UTM_Bande == "M" || UTM_Bande == "L" || UTM_Bande == "K" || UTM_Bande == "J" || UTM_Bande == "H" || UTM_Bande == "G" || UTM_Bande == "F" || UTM_Bande == "E" || UTM_Bande == "D" || UTM_Bande == "C")
			{
			var UTM_Emisph = "S";
			}
			else
				{
				alert("La lettre de la bande est erronée PAS de I O A B Y Z !");
				form.T_Ban_UTM.focus();
				return;
				}
			
	/* Gestion de la Zone - vérification 2 caractères - séparation des lettres */
	if(UTM_Zone.length != 2)
		{
		alert("La zone DOIT contenir 2 caractères !");
		form.T_Zon_UTM.focus();
		return;
		}
	 var UTM_Zone_X = UTM_Zone.substring(0,1);
	 var UTM_Zone_Y = UTM_Zone.substring(1,2);
	/* Traitement de la lettre Y (2ème) pour affecter le nombre de mètres à ajouter pour partir de l équateur*/
	if(UTM_Zone_Y == "I" || UTM_Zone_Y == "O" || UTM_Zone_Y == "W" || UTM_Zone_Y == "X" || UTM_Zone_Y == "Y" || UTM_Zone_Y == "Z")
		{
		alert("Second caratère de la ZONE Interdit - PAS de I O W X Y Z !");
		form.T_Zon_UTM.focus();
		return;
		}
	if(UTM_Zone_X == "I" || UTM_Zone_Y == "O")
		{
		alert("Premier caratère de la ZONE Interdit - PAS de I O !");
		form.T_Zon_UTM.focus();
		return;
		}
	
	if (UTM_Zone_Y == "A" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 0;
			break;
		case "Q" : var UTM_Ajout_Y = 2000000;
			break;
		case "S" : var UTM_Ajout_Y = 4000000;
			break;
		case "U" : var UTM_Ajout_Y = 6000000;
			break;
		case "X" : var UTM_Ajout_Y = 8000000;
			break;
		case "K" : var UTM_Ajout_Y = 1900000;
			break;
		case "H" : var UTM_Ajout_Y = 3900000;
			break;
		case "F" : var UTM_Ajout_Y = 5900000;
			break;
		case "D" : var UTM_Ajout_Y = 7900000;
			break;
		case "C" : var UTM_Ajout_Y = 7900000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "A" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1500000;
			break;
		case "R" : var UTM_Ajout_Y = 3500000;
			break;
		case "S" : var UTM_Ajout_Y = 3500000;
			break;
		case "U" : var UTM_Ajout_Y = 5500000;
			break;
		case "W" : var UTM_Ajout_Y = 7500000;
			break;
		case "X" : var UTM_Ajout_Y = 9500000;
			break;
		case "M" : var UTM_Ajout_Y = 400000;
			break;
		case "K" : var UTM_Ajout_Y = 2400000;
			break;
		case "H" : var UTM_Ajout_Y = 4400000;
			break;
		case "G" : var UTM_Ajout_Y = 4400000;
			break;
		case "E" : var UTM_Ajout_Y = 6400000;
			break;
		case "C" : var UTM_Ajout_Y = 8400000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "B" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 100000;
			break;
		case "Q" : var UTM_Ajout_Y = 2100000;
			break;
		case "S" : var UTM_Ajout_Y = 4100000;
			break;
		case "U" : var UTM_Ajout_Y = 6100000;
			break;
		case "X" : var UTM_Ajout_Y = 8100000;
			break;
		case "K" : var UTM_Ajout_Y = 1800000;
			break;
		case "H" : var UTM_Ajout_Y = 3800000;
			break;
		case "F" : var UTM_Ajout_Y = 5800000;
			break;
		case "D" : var UTM_Ajout_Y = 7800000;
			break;
		case "C" : var UTM_Ajout_Y = 9800000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "B" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1600000;
			break;
		case "S" : var UTM_Ajout_Y = 3600000;
			break;
		case "U" : var UTM_Ajout_Y = 5600000;
			break;
		case "W" : var UTM_Ajout_Y = 7600000;
			break;
		case "X" : var UTM_Ajout_Y = 9600000;
			break;
		case "M" : var UTM_Ajout_Y = 300000;
			break;
		case "K" : var UTM_Ajout_Y = 2300000;
			break;
		case "H" : var UTM_Ajout_Y = 4300000;
			break;
		case "E" : var UTM_Ajout_Y = 6300000;
			break;
		case "C" : var UTM_Ajout_Y = 8300000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "C" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 200000;
			break;
		case "Q" : var UTM_Ajout_Y = 2200000;
			break;
		case "S" : var UTM_Ajout_Y = 4200000;
			break;
		case "U" : var UTM_Ajout_Y = 6200000;
			break;
		case "V" : var UTM_Ajout_Y = 6200000;
			break;
		case "X" : var UTM_Ajout_Y = 8200000;
			break;
		case "L" : var UTM_Ajout_Y = 1700000;
			break;
		case "K" : var UTM_Ajout_Y = 1700000;
			break;
		case "H" : var UTM_Ajout_Y = 3700000;
			break;
		case "F" : var UTM_Ajout_Y = 5700000;
			break;
		case "D" : var UTM_Ajout_Y = 7700000;
			break;
		case "C" : var UTM_Ajout_Y = 9700000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "C" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1700000;
			break;
		case "Q" : var UTM_Ajout_Y = 1700000;
			break;
		case "S" : var UTM_Ajout_Y = 3700000;
			break;
		case "U" : var UTM_Ajout_Y = 5700000;
			break;
		case "W" : var UTM_Ajout_Y = 7700000;
			break;
		case "X" : var UTM_Ajout_Y = 9700000;
			break;
		case "M" : var UTM_Ajout_Y = 200000;
			break;
		case "K" : var UTM_Ajout_Y = 2200000;
			break;
		case "H" : var UTM_Ajout_Y = 4200000;
			break;
		case "F" : var UTM_Ajout_Y = 6200000;
			break;
		case "E" : var UTM_Ajout_Y = 6200000;
			break;
		case "C" : var UTM_Ajout_Y = 8200000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "D" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 300000;
			break;
		case "Q" : var UTM_Ajout_Y = 2300000;
			break;
		case "S" : var UTM_Ajout_Y = 4300000;
			break;
		case "V" : var UTM_Ajout_Y = 6300000;
			break;
		case "X" : var UTM_Ajout_Y = 8300000;
			break;
		case "L" : var UTM_Ajout_Y = 1600000;
			break;
		case "H" : var UTM_Ajout_Y = 3600000;
			break;
		case "F" : var UTM_Ajout_Y = 5600000;
			break;
		case "D" : var UTM_Ajout_Y = 7600000;
			break;
		case "C" : var UTM_Ajout_Y = 9600000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "D" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "Q" : var UTM_Ajout_Y = 1800000;
			break;
		case "S" : var UTM_Ajout_Y = 3800000;
			break;
		case "U" : var UTM_Ajout_Y = 5800000;
			break;
		case "W" : var UTM_Ajout_Y = 7800000;
			break;
		case "X" : var UTM_Ajout_Y = 9800000;
			break;
		case "M" : var UTM_Ajout_Y = 100000;
			break;
		case "K" : var UTM_Ajout_Y = 2100000;
			break;
		case "H" : var UTM_Ajout_Y = 4100000;
			break;
		case "F" : var UTM_Ajout_Y = 6100000;
			break;
		case "C" : var UTM_Ajout_Y = 8100000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "E" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 400000;
			break;
		case "Q" : var UTM_Ajout_Y = 2400000;
			break;
		case "S" : var UTM_Ajout_Y = 4400000;
			break;
		case "T" : var UTM_Ajout_Y = 4400000;
			break;
		case "V" : var UTM_Ajout_Y = 6400000;
			break;
		case "X" : var UTM_Ajout_Y = 8400000;
			break;
		case "L" : var UTM_Ajout_Y = 1500000;
			break;
		case "J" : var UTM_Ajout_Y = 3500000;
			break;
		case "H" : var UTM_Ajout_Y = 3500000;
			break;
		case "F" : var UTM_Ajout_Y = 5500000;
			break;
		case "D" : var UTM_Ajout_Y = 7500000;
			break;
		case "C" : var UTM_Ajout_Y = 9500000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "E" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "Q" : var UTM_Ajout_Y = 1900000;
			break;
		case "S" : var UTM_Ajout_Y = 3900000;
			break;
		case "U" : var UTM_Ajout_Y = 5900000;
			break;
		case "W" : var UTM_Ajout_Y = 7900000;
			break;
		case "X" : var UTM_Ajout_Y = 7900000;
			break;
		case "M" : var UTM_Ajout_Y = 0;
			break;
		case "K" : var UTM_Ajout_Y = 2000000;
			break;
		case "H" : var UTM_Ajout_Y = 4000000;
			break;
		case "F" : var UTM_Ajout_Y = 6000000;
			break;
		case "C" : var UTM_Ajout_Y = 8000000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "F" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 500000;
			break;
		case "Q" : var UTM_Ajout_Y = 2500000;
			break;
		case "T" : var UTM_Ajout_Y = 4500000;
			break;
		case "V" : var UTM_Ajout_Y = 6500000;
			break;
		case "X" : var UTM_Ajout_Y = 8500000;
			break;
		case "L" : var UTM_Ajout_Y = 1400000;
			break;
		case "J" : var UTM_Ajout_Y = 3400000;
			break;
		case "F" : var UTM_Ajout_Y = 5400000;
			break;
		case "D" : var UTM_Ajout_Y = 7400000;
			break;
		case "C" : var UTM_Ajout_Y = 9400000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "F" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 0;
			break;
		case "Q" : var UTM_Ajout_Y = 2000000;
			break;
		case "S" : var UTM_Ajout_Y = 4000000;
			break;
		case "U" : var UTM_Ajout_Y = 6000000;
			break;
		case "X" : var UTM_Ajout_Y = 8000000;
			break;
		case "K" : var UTM_Ajout_Y = 1900000;
			break;
		case "H" : var UTM_Ajout_Y = 3900000;
			break;
		case "F" : var UTM_Ajout_Y = 5900000;
			break;
		case "D" : var UTM_Ajout_Y = 7900000;
			break;
		case "C" : var UTM_Ajout_Y = 7900000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "G" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 600000;
			break;
		case "Q" : var UTM_Ajout_Y = 2600000;
			break;
		case "R" : var UTM_Ajout_Y = 2600000;
			break;
		case "T" : var UTM_Ajout_Y = 4600000;
			break;
		case "V" : var UTM_Ajout_Y = 6600000;
			break;
		case "X" : var UTM_Ajout_Y = 8600000;
			break;
		case "L" : var UTM_Ajout_Y = 1300000;
			break;
		case "J" : var UTM_Ajout_Y = 3300000;
			break;
		case "G" : var UTM_Ajout_Y = 5300000;
			break;
		case "F" : var UTM_Ajout_Y = 5300000;
			break;
		case "D" : var UTM_Ajout_Y = 7300000;
			break;
		case "C" : var UTM_Ajout_Y = 9300000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "G" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 100000;
			break;
		case "Q" : var UTM_Ajout_Y = 2100000;
			break;
		case "S" : var UTM_Ajout_Y = 4100000;
			break;
		case "U" : var UTM_Ajout_Y = 6100000;
			break;
		case "X" : var UTM_Ajout_Y = 8100000;
			break;
		case "K" : var UTM_Ajout_Y = 1800000;
			break;
		case "H" : var UTM_Ajout_Y = 3800000;
			break;
		case "F" : var UTM_Ajout_Y = 5800000;
			break;
		case "D" : var UTM_Ajout_Y = 7800000;
			break;
		case "C" : var UTM_Ajout_Y = 9800000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "H" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 700000;
			break;
		case "R" : var UTM_Ajout_Y = 2700000;
			break;
		case "T" : var UTM_Ajout_Y = 4700000;
			break;
		case "V" : var UTM_Ajout_Y = 6700000;
			break;
		case "X" : var UTM_Ajout_Y = 8700000;
			break;
		case "L" : var UTM_Ajout_Y = 1200000;
			break;
		case "J" : var UTM_Ajout_Y = 3200000;
			break;
		case "G" : var UTM_Ajout_Y = 5200000;
			break;
		case "D" : var UTM_Ajout_Y = 7200000;
			break;
		case "C" : var UTM_Ajout_Y = 9200000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "H" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 200000;
			break;
		case "Q" : var UTM_Ajout_Y = 2200000;
			break;
		case "S" : var UTM_Ajout_Y = 4200000;
			break;
		case "U" : var UTM_Ajout_Y = 6200000;
			break;
		case "V" : var UTM_Ajout_Y = 6200000;
			break;
		case "X" : var UTM_Ajout_Y = 8200000;
			break;
		case "L" : var UTM_Ajout_Y = 1700000;
			break;
		case "K" : var UTM_Ajout_Y = 1700000;
			break;
		case "H" : var UTM_Ajout_Y = 3700000;
			break;
		case "F" : var UTM_Ajout_Y = 5700000;
			break;
		case "D" : var UTM_Ajout_Y = 7700000;
			break;
		case "C" : var UTM_Ajout_Y = 9700000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "J" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 800000;
			break;
		case "P" : var UTM_Ajout_Y = 800000;
			break;
		case "R" : var UTM_Ajout_Y = 2800000;
			break;
		case "T" : var UTM_Ajout_Y = 4800000;
			break;
		case "V" : var UTM_Ajout_Y = 6800000;
			break;
		case "X" : var UTM_Ajout_Y = 8800000;
			break;
		case "L" : var UTM_Ajout_Y = 1100000;
			break;
		case "J" : var UTM_Ajout_Y = 3100000;
			break;
		case "G" : var UTM_Ajout_Y = 5100000;
			break;
		case "D" : var UTM_Ajout_Y = 7100000;
			break;
		case "C" : var UTM_Ajout_Y = 9100000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "J" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 300000;
			break;
		case "Q" : var UTM_Ajout_Y = 2300000;
			break;
		case "S" : var UTM_Ajout_Y = 4300000;
			break;
		case "V" : var UTM_Ajout_Y = 6300000;
			break;
		case "X" : var UTM_Ajout_Y = 8300000;
			break;
		case "L" : var UTM_Ajout_Y = 1600000;
			break;
		case "H" : var UTM_Ajout_Y = 3600000;
			break;
		case "F" : var UTM_Ajout_Y = 5600000;
			break;
		case "D" : var UTM_Ajout_Y = 7600000;
			break;
		case "C" : var UTM_Ajout_Y = 9600000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "K" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 900000;
			break;
		case "R" : var UTM_Ajout_Y = 2900000;
			break;
		case "T" : var UTM_Ajout_Y = 4900000;
			break;
		case "V" : var UTM_Ajout_Y = 6900000;
			break;
		case "X" : var UTM_Ajout_Y = 8900000;
			break;
		case "L" : var UTM_Ajout_Y = 1000000;
			break;
		case "J" : var UTM_Ajout_Y = 3000000;
			break;
		case "G" : var UTM_Ajout_Y = 5000000;
			break;
		case "E" : var UTM_Ajout_Y = 7000000;
			break;
		case "D" : var UTM_Ajout_Y = 7000000;
			break;
		case "C" : var UTM_Ajout_Y = 9000000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "K" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 400000;
			break;
		case "Q" : var UTM_Ajout_Y = 2400000;
			break;
		case "S" : var UTM_Ajout_Y = 4400000;
			break;
		case "T" : var UTM_Ajout_Y = 4400000;
			break;
		case "V" : var UTM_Ajout_Y = 6400000;
			break;
		case "X" : var UTM_Ajout_Y = 8400000;
			break;
		case "L" : var UTM_Ajout_Y = 1500000;
			break;
		case "J" : var UTM_Ajout_Y = 3500000;
			break;
		case "H" : var UTM_Ajout_Y = 3500000;
			break;
		case "F" : var UTM_Ajout_Y = 5500000;
			break;
		case "D" : var UTM_Ajout_Y = 7500000;
			break;
		case "C" : var UTM_Ajout_Y = 9500000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "L" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1000000;
			break;
		case "R" : var UTM_Ajout_Y = 3000000;
			break;
		case "T" : var UTM_Ajout_Y = 5000000;
			break;
		case "V" : var UTM_Ajout_Y = 7000000;
			break;
		case "W" : var UTM_Ajout_Y = 7000000;
			break;
		case "X" : var UTM_Ajout_Y = 9000000;
			break;
		case "L" : var UTM_Ajout_Y = 900000;
			break;
		case "J" : var UTM_Ajout_Y = 2900000;
			break;
		case "G" : var UTM_Ajout_Y = 4900000;
			break;
		case "E" : var UTM_Ajout_Y = 6900000;
			break;
		case "C" : var UTM_Ajout_Y = 8900000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "L" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 500000;
			break;
		case "Q" : var UTM_Ajout_Y = 2500000;
			break;
		case "T" : var UTM_Ajout_Y = 4500000;
			break;
		case "V" : var UTM_Ajout_Y = 6500000;
			break;
		case "X" : var UTM_Ajout_Y = 8500000;
			break;
		case "L" : var UTM_Ajout_Y = 1400000;
			break;
		case "J" : var UTM_Ajout_Y = 3400000;
			break;
		case "F" : var UTM_Ajout_Y = 5400000;
			break;
		case "D" : var UTM_Ajout_Y = 7400000;
			break;
		case "C" : var UTM_Ajout_Y = 9400000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "M" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1100000;
			break;
		case "R" : var UTM_Ajout_Y = 3100000;
			break;
		case "T" : var UTM_Ajout_Y = 5100000;
			break;
		case "W" : var UTM_Ajout_Y = 7100000;
			break;
		case "X" : var UTM_Ajout_Y = 9100000;
			break;
		case "M" : var UTM_Ajout_Y = 800000;
			break;
		case "L" : var UTM_Ajout_Y = 800000;
			break;
		case "J" : var UTM_Ajout_Y = 2800000;
			break;
		case "G" : var UTM_Ajout_Y = 4800000;
			break;
		case "E" : var UTM_Ajout_Y = 6800000;
			break;
		case "C" : var UTM_Ajout_Y = 8800000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "M" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 600000;
			break;
		case "Q" : var UTM_Ajout_Y = 2600000;
			break;
		case "R" : var UTM_Ajout_Y = 2600000;
			break;
		case "T" : var UTM_Ajout_Y = 4600000;
			break;
		case "V" : var UTM_Ajout_Y = 6600000;
			break;
		case "X" : var UTM_Ajout_Y = 8600000;
			break;
		case "L" : var UTM_Ajout_Y = 1300000;
			break;
		case "J" : var UTM_Ajout_Y = 3300000;
			break;
		case "G" : var UTM_Ajout_Y = 5300000;
			break;
		case "F" : var UTM_Ajout_Y = 5300000;
			break;
		case "D" : var UTM_Ajout_Y = 7300000;
			break;
		case "C" : var UTM_Ajout_Y = 9300000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "N" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1200000;
			break;
		case "R" : var UTM_Ajout_Y = 3200000;
			break;
		case "T" : var UTM_Ajout_Y = 5200000;
			break;
		case "W" : var UTM_Ajout_Y = 7200000;
			break;
		case "X" : var UTM_Ajout_Y = 9200000;
			break;
		case "M" : var UTM_Ajout_Y = 700000;
			break;
		case "J" : var UTM_Ajout_Y = 2700000;
			break;
		case "G" : var UTM_Ajout_Y = 4700000;
			break;
		case "E" : var UTM_Ajout_Y = 6700000;
			break;
		case "C" : var UTM_Ajout_Y = 8700000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "N" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 700000;
			break;
		case "R" : var UTM_Ajout_Y = 2700000;
			break;
		case "T" : var UTM_Ajout_Y = 4700000;
			break;
		case "V" : var UTM_Ajout_Y = 6700000;
			break;
		case "X" : var UTM_Ajout_Y = 8700000;
			break;
		case "L" : var UTM_Ajout_Y = 1200000;
			break;
		case "J" : var UTM_Ajout_Y = 3200000;
			break;
		case "G" : var UTM_Ajout_Y = 5200000;
			break;
		case "D" : var UTM_Ajout_Y = 7200000;
			break;
		case "C" : var UTM_Ajout_Y = 9200000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "P" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1300000;
			break;
		case "R" : var UTM_Ajout_Y = 3300000;
			break;
		case "T" : var UTM_Ajout_Y = 5300000;
			break;
		case "U" : var UTM_Ajout_Y = 5300000;
			break;
		case "W" : var UTM_Ajout_Y = 7300000;
			break;
		case "X" : var UTM_Ajout_Y = 9300000;
			break;
		case "M" : var UTM_Ajout_Y = 600000;
			break;
		case "K" : var UTM_Ajout_Y = 2600000;
			break;
		case "J" : var UTM_Ajout_Y = 2600000;
			break;
		case "G" : var UTM_Ajout_Y = 4600000;
			break;
		case "E" : var UTM_Ajout_Y = 6600000;
			break;
		case "C" : var UTM_Ajout_Y = 8600000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "P" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "N" : var UTM_Ajout_Y = 800000;
			break;
		case "P" : var UTM_Ajout_Y = 800000;
			break;
		case "R" : var UTM_Ajout_Y = 2800000;
			break;
		case "T" : var UTM_Ajout_Y = 4800000;
			break;
		case "V" : var UTM_Ajout_Y = 6800000;
			break;
		case "X" : var UTM_Ajout_Y = 8800000;
			break;
		case "L" : var UTM_Ajout_Y = 1100000;
			break;
		case "J" : var UTM_Ajout_Y = 3100000;
			break;
		case "G" : var UTM_Ajout_Y = 5100000;
			break;
		case "D" : var UTM_Ajout_Y = 7100000;
			break;
		case "C" : var UTM_Ajout_Y = 9100000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "Q" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1400000;
			break;
		case "R" : var UTM_Ajout_Y = 3400000;
			break;
		case "U" : var UTM_Ajout_Y = 5400000;
			break;
		case "W" : var UTM_Ajout_Y = 7400000;
			break;
		case "X" : var UTM_Ajout_Y = 9400000;
			break;
		case "M" : var UTM_Ajout_Y = 500000;
			break;
		case "K" : var UTM_Ajout_Y = 2500000;
			break;
		case "G" : var UTM_Ajout_Y = 4500000;
			break;
		case "E" : var UTM_Ajout_Y = 6500000;
			break;
		case "C" : var UTM_Ajout_Y = 8500000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "Q" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 900000;
			break;
		case "R" : var UTM_Ajout_Y = 2900000;
			break;
		case "T" : var UTM_Ajout_Y = 4900000;
			break;
		case "V" : var UTM_Ajout_Y = 6900000;
			break;
		case "X" : var UTM_Ajout_Y = 8900000;
			break;
		case "L" : var UTM_Ajout_Y = 1000000;
			break;
		case "J" : var UTM_Ajout_Y = 3000000;
			break;
		case "G" : var UTM_Ajout_Y = 5000000;
			break;
		case "E" : var UTM_Ajout_Y = 7000000;
			break;
		case "D" : var UTM_Ajout_Y = 7000000;
			break;
		case "C" : var UTM_Ajout_Y = 9000000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "R" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1500000;
			break;
		case "R" : var UTM_Ajout_Y = 3500000;
			break;
		case "S" : var UTM_Ajout_Y = 3500000;
			break;
		case "U" : var UTM_Ajout_Y = 5500000;
			break;
		case "W" : var UTM_Ajout_Y = 7500000;
			break;
		case "X" : var UTM_Ajout_Y = 9500000;
			break;
		case "M" : var UTM_Ajout_Y = 400000;
			break;
		case "K" : var UTM_Ajout_Y = 2400000;
			break;
		case "H" : var UTM_Ajout_Y = 4400000;
			break;
		case "G" : var UTM_Ajout_Y = 4400000;
			break;
		case "E" : var UTM_Ajout_Y = 6400000;
			break;
		case "C" : var UTM_Ajout_Y = 8400000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "R" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1000000;
			break;
		case "R" : var UTM_Ajout_Y = 3000000;
			break;
		case "T" : var UTM_Ajout_Y = 5000000;
			break;
		case "V" : var UTM_Ajout_Y = 7000000;
			break;
		case "W" : var UTM_Ajout_Y = 7000000;
			break;
		case "X" : var UTM_Ajout_Y = 9000000;
			break;
		case "L" : var UTM_Ajout_Y = 900000;
			break;
		case "J" : var UTM_Ajout_Y = 2900000;
			break;
		case "G" : var UTM_Ajout_Y = 4900000;
			break;
		case "E" : var UTM_Ajout_Y = 6900000;
			break;
		case "C" : var UTM_Ajout_Y = 8900000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "S" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1600000;
			break;
		case "S" : var UTM_Ajout_Y = 3600000;
			break;
		case "U" : var UTM_Ajout_Y = 5600000;
			break;
		case "W" : var UTM_Ajout_Y = 7600000;
			break;
		case "X" : var UTM_Ajout_Y = 9600000;
			break;
		case "M" : var UTM_Ajout_Y = 300000;
			break;
		case "K" : var UTM_Ajout_Y = 2300000;
			break;
		case "H" : var UTM_Ajout_Y = 4300000;
			break;
		case "E" : var UTM_Ajout_Y = 6300000;
			break;
		case "C" : var UTM_Ajout_Y = 8300000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "S" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1100000;
			break;
		case "R" : var UTM_Ajout_Y = 3100000;
			break;
		case "T" : var UTM_Ajout_Y = 5100000;
			break;
		case "W" : var UTM_Ajout_Y = 7100000;
			break;
		case "X" : var UTM_Ajout_Y = 9100000;
			break;
		case "M" : var UTM_Ajout_Y = 800000;
			break;
		case "L" : var UTM_Ajout_Y = 800000;
			break;
		case "J" : var UTM_Ajout_Y = 2800000;
			break;
		case "G" : var UTM_Ajout_Y = 4800000;
			break;
		case "E" : var UTM_Ajout_Y = 6800000;
			break;
		case "C" : var UTM_Ajout_Y = 8800000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "T" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1700000;
			break;
		case "Q" : var UTM_Ajout_Y = 1700000;
			break;
		case "S" : var UTM_Ajout_Y = 3700000;
			break;
		case "U" : var UTM_Ajout_Y = 5700000;
			break;
		case "W" : var UTM_Ajout_Y = 7700000;
			break;
		case "X" : var UTM_Ajout_Y = 9700000;
			break;
		case "M" : var UTM_Ajout_Y = 200000;
			break;
		case "K" : var UTM_Ajout_Y = 2200000;
			break;
		case "H" : var UTM_Ajout_Y = 4200000;
			break;
		case "F" : var UTM_Ajout_Y = 6200000;
			break;
		case "E" : var UTM_Ajout_Y = 6200000;
			break;
		case "C" : var UTM_Ajout_Y = 8200000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "T" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1200000;
			break;
		case "R" : var UTM_Ajout_Y = 3200000;
			break;
		case "T" : var UTM_Ajout_Y = 5200000;
			break;
		case "W" : var UTM_Ajout_Y = 7200000;
			break;
		case "X" : var UTM_Ajout_Y = 9200000;
			break;
		case "M" : var UTM_Ajout_Y = 700000;
			break;
		case "J" : var UTM_Ajout_Y = 2700000;
			break;
		case "G" : var UTM_Ajout_Y = 4700000;
			break;
		case "E" : var UTM_Ajout_Y = 6700000;
			break;
		case "C" : var UTM_Ajout_Y = 8700000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "U" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "Q" : var UTM_Ajout_Y = 1800000;
			break;
		case "S" : var UTM_Ajout_Y = 3800000;
			break;
		case "U" : var UTM_Ajout_Y = 5800000;
			break;
		case "W" : var UTM_Ajout_Y = 7800000;
			break;
		case "X" : var UTM_Ajout_Y = 9800000;
			break;
		case "M" : var UTM_Ajout_Y = 100000;
			break;
		case "K" : var UTM_Ajout_Y = 2100000;
			break;
		case "H" : var UTM_Ajout_Y = 4100000;
			break;
		case "F" : var UTM_Ajout_Y = 6100000;
			break;
		case "C" : var UTM_Ajout_Y = 8100000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "U" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1300000;
			break;
		case "R" : var UTM_Ajout_Y = 3300000;
			break;
		case "T" : var UTM_Ajout_Y = 5300000;
			break;
		case "U" : var UTM_Ajout_Y = 5300000;
			break;
		case "W" : var UTM_Ajout_Y = 7300000;
			break;
		case "X" : var UTM_Ajout_Y = 9300000;
			break;
		case "M" : var UTM_Ajout_Y = 600000;
			break;
		case "K" : var UTM_Ajout_Y = 2600000;
			break;
		case "J" : var UTM_Ajout_Y = 2600000;
			break;
		case "G" : var UTM_Ajout_Y = 4600000;
			break;
		case "E" : var UTM_Ajout_Y = 6600000;
			break;
		case "C" : var UTM_Ajout_Y = 8600000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if (UTM_Zone_Y == "V" && UTM_Fus_Pair == 0)
	{
		switch (UTM_Bande)
		{case "Q" : var UTM_Ajout_Y = 1900000;
			break;
		case "S" : var UTM_Ajout_Y = 3900000;
			break;
		case "U" : var UTM_Ajout_Y = 5900000;
			break;
		case "W" : var UTM_Ajout_Y = 7900000;
			break;
		case "X" : var UTM_Ajout_Y = 7900000;
			break;
		case "M" : var UTM_Ajout_Y = 0;
			break;
		case "K" : var UTM_Ajout_Y = 2000000;
			break;
		case "H" : var UTM_Ajout_Y = 4000000;
			break;
		case "F" : var UTM_Ajout_Y = 6000000;
			break;
		case "C" : var UTM_Ajout_Y = 8000000;
			break;
		default : var UTM_Ajout_Y = -1;
		}
	}	
	if (UTM_Zone_Y == "V" && UTM_Fus_Pair == 1)
	{
		switch (UTM_Bande)
		{case "P" : var UTM_Ajout_Y = 1400000;
			break;
		case "R" : var UTM_Ajout_Y = 3400000;
			break;
		case "U" : var UTM_Ajout_Y = 5400000;
			break;
		case "W" : var UTM_Ajout_Y = 7400000;
			break;
		case "X" : var UTM_Ajout_Y = 9400000;
			break;
		case "M" : var UTM_Ajout_Y = 500000;
			break;
		case "K" : var UTM_Ajout_Y = 2500000;
			break;
		case "G" : var UTM_Ajout_Y = 4500000;
			break;
		case "E" : var UTM_Ajout_Y = 6500000;
			break;
		case "C" : var UTM_Ajout_Y = 8500000;
			break;
		default : var UTM_Ajout_Y = -1;
		}	
	}	
	if(UTM_Ajout_Y == -1)
		{
		alert("Second caractère de la ZONE erroné - PAS de " + UTM_Zone_Y + " dans la bande " + UTM_Bande + " !");
		form.T_Zon_UTM.focus();
		return;
		}
	
	/* Traitement de la valeur X (premier caractère) de la Zone */
	for (sequence = 1; sequence <= 60; sequence = sequence + 3)
		{
		if (sequence == UTM_Fus)
			{
			switch (UTM_Zone_X)
			{case "A" : var UTM_Ajout_X = 0;
				break;
			case "B" : var UTM_Ajout_X = 200000;
				break;
			case "C" : var UTM_Ajout_X = 300000;
				break;
			case "D" : var UTM_Ajout_X = 400000;
				break;
			case "E" : var UTM_Ajout_X = 500000;
				break;
			case "F" : var UTM_Ajout_X = 600000;
				break;
			case "G" : var UTM_Ajout_X = 700000;
				break;
			case "H" : var UTM_Ajout_X = 800000;
				break;
			default : var UTM_Ajout_X = -1;
			}
			//alert ("Cycle de A à H");
			break;
			}
		}
	
	for (sequence = 2; sequence <= 60; sequence = sequence + 3)
		{
		if (sequence == UTM_Fus)
			{
			switch (UTM_Zone_X)
			{case "J" : var UTM_Ajout_X = 0;
				break;
			case "K" : var UTM_Ajout_X = 200000;
				break;
			case "L" : var UTM_Ajout_X = 300000;
				break;
			case "M" : var UTM_Ajout_X = 400000;
				break;
			case "N" : var UTM_Ajout_X = 500000;
				break;
			case "P" : var UTM_Ajout_X = 600000;
				break;
			case "R" : var UTM_Ajout_X = 700000;
				break;
			case "R" : var UTM_Ajout_X = 800000;
				break;
			default : var UTM_Ajout_X = -1;
			}
			//alert ("Cycle de J à R");
			break;
			}
		}
	
	for (sequence = 3; sequence <= 60; sequence = sequence + 3)
		{
		if (sequence == UTM_Fus)
			{
			switch (UTM_Zone_X)
			{case "S" : var UTM_Ajout_X = 0;
				break;
			case "T" : var UTM_Ajout_X = 200000;
				break;
			case "U" : var UTM_Ajout_X = 300000;
				break;
			case "V" : var UTM_Ajout_X = 400000;
				break;
			case "W" : var UTM_Ajout_X = 500000;
				break;
			case "X" : var UTM_Ajout_X = 600000;
				break;
			case "Y" : var UTM_Ajout_X = 700000;
				break;
			case "Z" : var UTM_Ajout_X = 800000;
				break;
			default : var UTM_Ajout_X = -1;
			}
			//alert ("Cycle de S à Z");
			break;
			}
		}
	
	if(UTM_Ajout_X == -1)
		{
		alert("Premier caractère de la ZONE erroné - PAS de " + UTM_Zone_X + " dans le fuseau " + UTM_Fus + " !");
		form.T_Zon_UTM.focus();
		return;
		}
	
	/* Affectation des variables alphanumériques aux valeurs E (X) et N (Y) */
	var UTM_E = UTM_X + UTM_Ajout_X;
	
	/* Si le calcul se fait dans hémisphère NORD - On reste dans le calcul des carrès ajouté à la valeur Y */
	if(UTM_Emisph == "N")
		{
		var UTM_N = UTM_Y + UTM_Ajout_Y;	
		}
	/* Si le calcul se fait dans l'hémisphère SUD - du pôle SUD 0 on va vers l'équateur à 10 000 000 mètres */
	if(UTM_Emisph == "S")
		{
		var UTM_N = (10000000 - (UTM_Ajout_Y + 100000)) + UTM_Y
		}
	
	/* Gestion des cas A J et S qui commencent à 166000 mètres */
	if(UTM_Zone_X == "A" || UTM_Zone_X == "J" || UTM_Zone_X == "S")
		{
		if(UTM_E < 166000)
			{
			alert("Dans cette ZONE équatoriale la valeur calculée de X est erronée - NE PEUT PAS ETRE INFERIEURE A 166 000 mètres !");
			form.T_Zon_UTM.focus();
			return;
			}
		}
	
	/* Gestion des cas H R et Z qui terminent à 833000 mètres */
	if(UTM_Zone_X == "H" || UTM_Zone_X == "R" || UTM_Zone_X == "Z")
		{
		if(UTM_E > 833000)
			{
			alert("Dans cette ZONE équatoriale la valeur calculée de X est erronée - NE PEUT PAS ETRE SUPERIEURE A 833 000 mètres !");
			form.T_Zon_UTM.focus();
			return;
			}
		}
	
	/* ATTENTION GERER LE FAIT QU AU NORD ON S ARRETE A LA BANDE X QUI VA DE 72 A 84° et au sud la bande C qui va de 72 à 80° */
	//alert("Valeur E sens UTM vers ED50 " + UTM_E);
	//alert("Valeur N sens UTM vers ED50 " + UTM_N);

	/* Renommage des valeurs N et E en NN et EE pour éviter les confusions de variables */
	var UTM_NN = UTM_N;
	var UTM_EE = UTM_E;

	/* Constantes Ellipsoïde Hayford 09 UTM*/
	var UTM_a = 6378388.00;
	var UTM_f = 297;
	var UTM_b = UTM_a - (UTM_a / UTM_f);
	var UTM_e2 = (Math.pow(UTM_a,2) - Math.pow(UTM_b,2)) / Math.pow(UTM_a,2);
	var UTM_e = Math.sqrt(UTM_e2);
	
	/* Constantes de la projection UTM */
	/* Constante Module Linéaire */
	var UTM_Mod_Lin = 0.9996;
	/* Constantes de projection UTM NORD */
	if(UTM_Emisph == "N")
		{
		/* Rayon de la sphère intermédiaire en mètres */
		var UTM_n = UTM_a * UTM_Mod_Lin;
		/* Longitude d origine par rapport au méridien Greenwich et fuseau calculé en degré*/
		var UTM_Lambda_c = 6 * UTM_Fus - 183;
		/* Constante EST en mètres*/
		var UTM_Ce = 500000;
		/* Constante NORD en mètres*/
		var UTM_Cn = 0;
		}
	/* Constantes de projection UTM SUD */
	if(UTM_Emisph == "S")
		{
		/* Rayon de la sphère intermédiaire en mètres */
		var UTM_n = UTM_b * UTM_Mod_Lin;
		/* Longitude d origine par rapport au méridien Greenwich et fuseau calculé en degré*/
		var UTM_Lambda_c = 6 * UTM_Fus - 183;
		/* Constante EST en mètres*/
		var UTM_Ce = 500000;
		/* Constante NORD en mètres*/
		var UTM_Cn = 10000000;
		}
	
	/* Coefficients de projection en fonction de l excentricité Hayford 1909 */
	var UTM_C1 = 1 - UTM_e2 / 4 - 3 * Math.pow(UTM_e2,2) / 64 - 5 * Math.pow(UTM_e2,3) / 256 - 175 * Math.pow(UTM_e2,4) / 16384;
	var UTM_C2 = UTM_e2 / 8 + Math.pow(UTM_e2,2) / 48 + 7 * Math.pow(UTM_e2,3) / 2048 + Math.pow(UTM_e2,4) / 61440;
	var UTM_C3 = Math.pow(UTM_e2,2) / 768 + 3 * Math.pow(UTM_e2,3) / 1280 + 559 * Math.pow(UTM_e2,4) / 368640;
	var UTM_C4 = 17 / 30720 * Math.pow(UTM_e2,3) + 283 / 430080 * Math.pow(UTM_e2,4);
	var UTM_C5 = 4397 / 41287680 * Math.pow(UTM_e2,4);
	
	/* Nombre complexe intermédiaire z où zA est la partie réelle et zB la partie imaginaire */
	var UTM_zA = (UTM_NN - UTM_Cn) / UTM_n / UTM_C1;
	var UTM_zB = (UTM_EE - UTM_Ce) / UTM_n / UTM_C1;
	
	/* Complexe final Z = z - somme Cj * sin(2*j*z) */
	/* Partie réelle L décomposé longue ligne sinon... en radians */
	var UTM_L1_1 = UTM_C2 * Math.sin(2 * UTM_zA) * ((Math.exp(2 * UTM_zB) + Math.exp(2 * UTM_zB * -1)) / 2);
	var UTM_L1_2 = UTM_C3 * Math.sin(4 * UTM_zA) * ((Math.exp(4 * UTM_zB) + Math.exp(4 * UTM_zB * -1)) / 2);
	var UTM_L1_3 = UTM_C4 * Math.sin(6 * UTM_zA) * ((Math.exp(6 * UTM_zB) + Math.exp(6 * UTM_zB * -1)) / 2);
	var UTM_L1_4 = UTM_C5 * Math.sin(8 * UTM_zA) * ((Math.exp(8 * UTM_zB) + Math.exp(8 * UTM_zB * -1)) / 2);
	var UTM_L = UTM_zA - UTM_L1_1 - UTM_L1_2 - UTM_L1_3 - UTM_L1_4;
	/* Partie imaginaire Ls décomposé aussi en radians */
	var UTM_Ls1_1 = UTM_C2 * Math.cos(2 * UTM_zA) * ((Math.exp(2 * UTM_zB) - Math.exp(2 * UTM_zB * -1)) / 2);
	var UTM_Ls1_2 = UTM_C3 * Math.cos(4 * UTM_zA) * ((Math.exp(4 * UTM_zB) - Math.exp(4 * UTM_zB * -1)) / 2);
	var UTM_Ls1_3 = UTM_C4 * Math.cos(6 * UTM_zA) * ((Math.exp(6 * UTM_zB) - Math.exp(6 * UTM_zB * -1)) / 2);
	var UTM_Ls1_4 = UTM_C5 * Math.cos(8 * UTM_zA) * ((Math.exp(8 * UTM_zB) - Math.exp(8 * UTM_zB * -1)) / 2);
	var UTM_Ls = UTM_zB - UTM_Ls1_1 - UTM_Ls1_2 - UTM_Ls1_3 - UTM_Ls1_4;
	
	/* Latitude Sphérique */
	var UTM_Lat_Sph = Math.asin(Math.sin(UTM_L) / ((Math.exp(UTM_Ls) + Math.exp(UTM_Ls * -1)) / 2));
	/* Latitude isométrique */
	var UTM_Lat_Iso = Math.log(Math.tan(Math.PI / 4 + UTM_Lat_Sph / 2));
	
	/* Latitude Lambda en degrés décimaux sur Hayford 09 - UTM_Lambda */
	var UTM_Lambda = UTM_Lambda_c + Math.atan(((Math.exp(UTM_Ls) - Math.exp(UTM_Ls * -1)) / 2) / Math.cos(UTM_L)) * (180 / Math.PI);
		
	/* Latitude Phi en degrés décimaux sur Hayford 09 - UTM_Phi = difficile à énoncer calcul récurcif */
	var ecart = 1;
	var Phi = 2 * Math.atan(Math.exp(UTM_Lat_Iso)) - Math.PI / 2;
	while (ecart > 0.000000000001)
		{
		Phi_1 = 2 * (Math.atan(Math.exp(UTM_Lat_Iso + UTM_e / 2 * Math.log((1 + UTM_e * Math.sin(Phi)) / (1 - UTM_e * Math.sin(Phi)))))) - Math.PI / 2;
		ecart = Math.abs(Phi_1 - Phi);
		Phi = Phi_1;
		}
	var UTM_Phi = Phi * 180 / Math.PI;
	
	/* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (UTM_Lambda > 0)
		{
		var E_W_Long_UTM = "E";
		}
	else
		{
		var E_W_Long_UTM = "W";
		}
	var UTM_Lambda = Math.abs(UTM_Lambda);
	var Deg_Long_UTM = Math.abs(Math.floor(UTM_Lambda));
	var Min_Long_UTM = Math.floor((UTM_Lambda - Deg_Long_UTM) * 60);
	var Sec_Long_UTM = Math.round(((UTM_Lambda - Deg_Long_UTM - Min_Long_UTM / 60) * 3600)*1000)/1000;
	
     	/* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde */
	var UTM_Phi = Math.abs(UTM_Phi);
	var Deg_Lat_UTM = Math.floor(UTM_Phi);
	var Min_Lat_UTM = Math.floor((UTM_Phi - Deg_Lat_UTM) * 60);
	var Sec_Lat_UTM = Math.round(((UTM_Phi - Deg_Lat_UTM - Min_Lat_UTM / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_P.value = Deg_Lat_UTM
	form.T_Lat_Min_P.value = Min_Lat_UTM
	form.T_Lat_Sec_P.value = Sec_Lat_UTM
	if (UTM_Emisph == "N")
		{
		form.selectNS1.selectedIndex = 0
		}
	if (UTM_Emisph == "S")
		{
		form.selectNS1.selectedIndex = 1
		}
	form.T_Long_Deg_P.value = Deg_Long_UTM
	form.T_Long_Min_P.value = Min_Long_UTM
	form.T_Long_Sec_P.value = Sec_Long_UTM
	if (E_W_Long_UTM == "E")
		{
		form.selectEW1.selectedIndex = 0
		}
	if (E_W_Long_UTM == "W")
		{
		form.selectEW1.selectedIndex = 1
		}
	}
	/* Fin de la fonction UTM_ED50 - UTM plane - Hayford 1909 (3) -- VERS -- Priam (ED50) Sexa - Hayford 1909 (3) */
	
	
	
	
	
function NTF_ED50(form)
/* De GeoConcept (NTF) Sexa - Clarke 1880 (1) -- VERS --  PRIAM (ED50) - Hayford 1909 (3) */
	{
	/* Constantes Ellipsoïde Hayford PRIAM ED50 */
	var Hayford_a = 6378388.00;
	var Hayford_f = 297;
	var Hayford_b = Hayford_a - (Hayford_a / Hayford_f);
	var Hayford_e = (Math.pow(Hayford_a,2) - Math.pow(Hayford_b,2)) / Math.pow(Hayford_a,2);

	/* Constantes Ellipsoïde Clarke GeoConcept NTF */
	var Clarke_a = 6378249.2;
	var Clarke_b = 6356515;
	var Clarke_f = 1 / ((Clarke_a - Clarke_b) / Clarke_a);
	var Clarke_e = (Math.pow(Clarke_a,2) - Math.pow(Clarke_b,2)) / Math.pow(Clarke_a,2);

	/* Constantes Tx, Ty, Tz en mètres de Transformation de 1 vers 3 */
	var Tx = -84;
	var Ty = 37;
	var Tz = 437;

	/* Coordonnées LONGITUDE NTF Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW2.selectedIndex;
	if(ChoixEW == 0)
		{
		var NTF_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var NTF_Long_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var NTF_Long_Sgn = parseFloat(NTF_Long_Signe);
	var NTF_Long_Deg = parseFloat(form.T_Long_Deg_G.value);
	var NTF_Long_Min = parseFloat(form.T_Long_Min_G.value);
	var NTF_Long_Sec = parseFloat(form.T_Long_Sec_G.value);

	/* Coordonnées LONGITUDE NTF (Lambda) Décimale calculée */
	var NTF_Long_Dec = NTF_Long_Sgn * ((NTF_Long_Deg) + (NTF_Long_Min / 60) + (NTF_Long_Sec / 3600));

	/* Coordonnées LATITUDE NTF Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	var ChoixNS = form.selectNS2.selectedIndex;
	if(ChoixNS == 0)
		{
		var NTF_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var NTF_Lat_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var NTF_Lat_Sgn = parseFloat(NTF_Lat_Signe);
	var NTF_Lat_Deg = parseFloat(form.T_Lat_Deg_G.value);
	var NTF_Lat_Min = parseFloat(form.T_Lat_Min_G.value);
	var NTF_Lat_Sec = parseFloat(form.T_Lat_Sec_G.value);

	/* Coordonnées LATITUDE NTF (Phi) Décimale calculée */
	var NTF_Lat_Dec = NTF_Lat_Sgn * ((NTF_Lat_Deg) + (NTF_Lat_Min / 60) + (NTF_Lat_Sec / 3600));

	/* Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur */
	var Hauteur = 0;

	/* Référence Méridien de Grennwich pas décalage d'un système à l'autre */

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'NTF' Origine (Clarke 1880 - NTF)
	/* Variable v (en mètres) calculée par la fct Hayford_a / Racine(1-(Hayford_e*sin(Pri_Lat_Dec*(Pi/180)))^2) */
	var NTF_v = Clarke_a / (Math.sqrt(1 - (Clarke_e * Math.pow(Math.sin(NTF_Lat_Dec * (Math.PI / 180)),2))))

	/* Variable X calculée en mètres X = (v+h).Cos(Phi).Cos(Lambda) */
	var NTF_X = (NTF_v + Hauteur) * Math.cos(NTF_Lat_Dec * (Math.PI / 180)) * Math.cos(NTF_Long_Dec * (Math.PI / 180));

	/* Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) */
	var NTF_Y = (NTF_v + Hauteur) * Math.cos(NTF_Lat_Dec * (Math.PI / 180)) * Math.sin(NTF_Long_Dec * (Math.PI / 180));

	/* Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) */
	var NTF_Z = (NTF_v * (1 - Clarke_e) + Hauteur) * Math.sin(NTF_Lat_Dec * (Math.PI / 180));

     /* Partie - coordonnées géocentriques sur l'ellipsoïde 'ED50' Destination ( Hayford 1909 - ED50 Priam) */
	/* Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux */
	var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
	/* Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 */
	var Lambda_0 = 0;

	/* Variable X calculée en mètres X'= Tx + X * Cos(Lambda_0) + Y * Sin(Lambda_0) */
	var ED50_X = Tx + NTF_X * Math.cos(Lambda_0 * (Math.PI / 180)) + NTF_Y * Math.sin(Lambda_0 * (Math.PI / 180));

	/* Variable Y calculée en mètres Y'= Ty - X * Sin(Lambda_0) + Y * Cos(Lambda_0) */
	var ED50_Y = Ty - NTF_X * Math.sin(Lambda_0 * (Math.PI / 180)) + NTF_Y * Math.cos(Lambda_0 * (Math.PI / 180));

	/* Variable Z calculée en mètres Z'= Z + Tz */
	var ED50_Z = NTF_Z + Tz;

	/* Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat */
	var Re_1 = Math.sqrt(Math.pow(ED50_X,2) + (Math.pow(ED50_Y,2)));

     /* Partie Coordonnées géographiques sur l'ellipsoïde de destination - Hayford 1909 - Origine Greenwich */
	/* Longitude Lambda en degrés décimaux sur Hayford */
	var Long_ED50_Dec = Math.atan(ED50_Y / ED50_X) / (Math.PI / 180);

	/* Latitude Phi en degrés décimaux sur Hayford - Lat_ED50_Dec = difficile à énoncer calcul récurcif */
	var ecart = 1;
	var Phi = NTF_Lat_Dec / (180 * Math.PI);
	while (ecart > 0.0000000001)
		{
		Phi_1 = Math.atan((ED50_Z + Hayford_e * Math.sin(Phi) * Hayford_a / Math.sqrt(1 - Hayford_e * Math.pow(Math.sin(Phi),2))) / Re_1);
		ecart = Math.abs(Phi - Phi_1);
		Phi = Phi_1;
		}
	var Lat_ED50_Dec = Phi * (180 / Math.PI);

	/* Variable v en mètre sur Geoïde de destination - ED50_v */
	var ED50_v = Hayford_a / (Math.sqrt(1 - (Hayford_e * Math.pow(Math.sin(Lat_ED50_Dec * (Math.PI / 180)),2))));

	/* Hauteur ellipsoïdale h_ED50 en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde */
	var h_ED50 = Re_1 / Math.cos(Lat_ED50_Dec*(Math.PI / 180)) - ED50_v;

     /* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (Long_ED50_Dec > 0)
		{
		var E_W_Long_ED50 = "E";
		}
	else
		{
		var E_W_Long_ED50 = "W";
		}
	var Long_ED50_Dec = Math.abs(Long_ED50_Dec);
	var Deg_Long_ED50 = Math.abs(Math.floor(Long_ED50_Dec));
	var Min_Long_ED50 = Math.floor((Long_ED50_Dec - Deg_Long_ED50) * 60);
	var Sec_Long_ED50 = Math.round(((Long_ED50_Dec - Deg_Long_ED50 - Min_Long_ED50 / 60) * 3600)*1000)/1000;
	
     /* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S */
	if (Lat_ED50_Dec > 0)
		{
		var N_S_Lat_ED50 = "N";
		}
	else
		{
		var N_S_Lat_ED50 = "S";
		}
	var Lat_ED50_Dec = Math.abs(Lat_ED50_Dec);
	var Deg_Lat_ED50 = Math.floor(Lat_ED50_Dec);
	var Min_Lat_ED50 = Math.floor((Lat_ED50_Dec - Deg_Lat_ED50) * 60);
	var Sec_Lat_ED50 = Math.round(((Lat_ED50_Dec - Deg_Lat_ED50 - Min_Lat_ED50 / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_P.value = Deg_Lat_ED50
	form.T_Lat_Min_P.value = Min_Lat_ED50
	form.T_Lat_Sec_P.value = Sec_Lat_ED50
	if (N_S_Lat_ED50 == "N")
		{
		form.selectNS1.selectedIndex = 0
		}
	if (N_S_Lat_ED50 == "S")
		{
		form.selectNS1.selectedIndex = 1
		}
	form.T_Long_Deg_P.value = Deg_Long_ED50
	form.T_Long_Min_P.value = Min_Long_ED50
	form.T_Long_Sec_P.value = Sec_Long_ED50
	if (E_W_Long_ED50 == "E")
		{
		form.selectEW1.selectedIndex = 0
		}
	if (E_W_Long_ED50 == "W")
		{
		form.selectEW1.selectedIndex = 1
		}
     
/* Fin de la fonction NTF_ED50 - GeoConcept (NTF) Sexa - Clarke 1880 (1) -- VERS -- PRIAM (ED50) - Hayford 1909 (3) */
	}	
	

function Lamb_NTF(form)
/* De Lambert II étendu (NTF) métrique - Clarke 1880 (1) -- VERS -- (NTF) - Clarke 1880 (1) */
	{
	/* Début des calculs sur une base de Lambert II ---- Voir si portable en Etendu */
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var Lamb_EE = parseFloat(form.T_X_Lamb.value);
	var Lamb_NN = parseFloat(form.T_Y_Lamb.value);
	/* Recherche de la zone Lambert du point - Inutilisé pour l'instant - Seul Lambert II*/
	var Lamb_Zone = Math.floor(Lamb_NN / 1000000);
	
	/* Constante pour la Zone II Lambert */
	/* Calcul des constantes sur le goide Clarke 1880 pour Lambert II */
	var Lamb_a = 6378249.2;
	var Lamb_f = 293.466021300;
	var Lamb_b = Lamb_a * (1 - 1 / Lamb_f);
	var Lamb_e = Math.sqrt((Math.pow(Lamb_a,2) - Math.pow(Lamb_b,2)) / Math.pow(Lamb_a,2));
	var Lamb_Phi1 = 50.99879884 / 200 * 180;
	var Lamb_Phi2 = 52.99557167 / 200 * 180;
	var Lamb_vo1 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi1 * Math.PI / 180),2)));
	var Lamb_vo2 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi2 * Math.PI / 180),2)));
	/* Phi0 est la Latitude du parallèle d origine */
	var Lamb_Phi0 = 52 * 0.9;
	var Lamb_po1 = Lamb_a * (1 - Math.pow(Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow(Lamb_e,2) * Math.pow((Math.sin(Lamb_Phi1 * Math.PI / 180)),2))),3);
	var Lamb_po2 = Lamb_a * (1 - Math.pow(Lamb_e,2)) / Math.pow((Math.sqrt(1 - Math.pow(Lamb_e,2) * Math.pow((Math.sin(Lamb_Phi2 * Math.PI / 180)),2))),3);
	var Lamb_m1 = 1 + Lamb_po1 / 2 / Lamb_vo1 * Math.pow(((Lamb_Phi1 - Lamb_Phi0) * Math.PI / 180),2); 
	var Lamb_m2 = 1 + Lamb_po2 / 2 / Lamb_vo2 * Math.pow(((Lamb_Phi2 - Lamb_Phi0) * Math.PI / 180),2);
	var Lamb_m = (Lamb_m1 + Lamb_m2) / 2;
	var Lamb_CE = 600;
	var Lamb_CN = 2200;
	var Lamb_mL = 2 - Lamb_m;
	var Lamb_v0 = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(Lamb_Phi0 * Math.PI / 180),2)));
	var Lamb_R0 = Lamb_v0 / Math.tan(Lamb_Phi0 * Math.PI / 180);
	/* mLR0 est le Rayon du parallèle d origine après réduction d echelle */
	var Lamb_mLR0 = Lamb_mL * Lamb_R0;
	var Lamb_Ls = Math.log(Math.tan(Math.PI / 4 + Lamb_Phi0 / 2 * Math.PI / 180)) - Lamb_e / 2 * Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180 )) / (1 - Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)));
	
	/* Abscisse en m dans le repère associé aux méridien et parallèle d'origine */
	var Lamb_E1 = Lamb_EE - Lamb_CE * 1000;
	/* Ordonnée en m dans le repère associé aux méridien et parallèle d'origine */
	var Lamb_N1 = Lamb_NN - Lamb_CN * 1000;
	/* Convergence des méridiens en degrés */
	Lamb_gamma = Math.atan(Lamb_E1 / (Lamb_mLR0 - Lamb_N1)) * 180 / Math.PI;
	/* Lambda0 est la Longitude du méridien de Paris en degré */
	var Lamb_Lambda0 = 2.596921296 / 200 * 180;
	/* Longitude du point recherché en degré par rapport à Greenwich */
	var NTF_Lambda = (Lamb_gamma / Math.sin(Lamb_Phi0 * Math.PI / 180) + Lamb_Lambda0);
	
	/* Rayon du parallèle passant par le point recherché - en mètres */
	var Lamb_R = (Lamb_mLR0 - Lamb_N1) / Math.cos(Lamb_gamma * Math.PI / 180);
	/* Valeur de L0 pour Phi0 */
	var Lamb_L0 = Math.log(Math.tan(Math.PI / 4 + Lamb_Phi0 * Math.PI / 360)) - (Lamb_e / 2) * Math.log((1 + Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)) / (1 - Lamb_e * Math.sin(Lamb_Phi0 * Math.PI / 180)));
	/* Latitude isométrique L en fonction  de Phi */
	var Lamb_L = Lamb_L0 + Math.log(Lamb_mLR0 / Lamb_R) / Math.sin(Lamb_Phi0 * Math.PI / 180);
	/* Latitude du point recherché */
	/* Latitude Phi en degrés décimaux */
	var ecart = 1;
	var Phi = 2 * Math.atan(Math.exp(Lamb_L)) - Math.PI / 2;
	while (ecart > 0.000000000001)
		{
		Phi_1 = 2 * (Math.atan(Math.exp(Lamb_L + Lamb_e / 2 * Math.log((1 + Lamb_e * Math.sin(Phi)) / (1 - Lamb_e * Math.sin(Phi)))))) - Math.PI / 2;
		ecart = Math.abs(Phi_1 - Phi);
		Phi = Phi_1;
		}
	var NTF_Phi = Phi * 180 / Math.PI;
	
	/* Module de correction à la projection du point donné */
	/* Rayon de courbure de l ellipse normale principale */
	var Lamb_v = Lamb_a / Math.sqrt(1 - Math.pow(Lamb_e,2) * (Math.pow(Math.sin(NTF_Phi * Math.PI / 180),2)));
	/* Module de réduction à la projection */
	var Lamb_mr = Lamb_R * Math.sin(Lamb_Phi0 * Math.PI / 180) / Lamb_v / Math.cos(NTF_Phi * Math.PI / 180);
	/* Coefficient d altération linéaire en centimètres par kilomètres */
	var Lamb_kr = (Lamb_mr - 1) * 100000;
	
	/* Mise en forme des latitude Longitude en DMS */
	/* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (NTF_Lambda > 0)
		{
		var E_W_Long_NTF = "E";
		}
	else
		{
		var E_W_Long_NTF = "W";
		}
	var NTF_Lambda = Math.abs(NTF_Lambda);
	var Deg_Long_NTF = Math.abs(Math.floor(NTF_Lambda));
	var Min_Long_NTF = Math.floor((NTF_Lambda - Deg_Long_NTF) * 60);
	var Sec_Long_NTF = Math.round(((NTF_Lambda - Deg_Long_NTF - Min_Long_NTF / 60) * 3600)*1000)/1000;
	
     /* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S */
	if (NTF_Phi > 0)
		{
		var N_S_Lat_NTF = "N";
		}
	else
		{
		var N_S_Lat_NTF = "S";
		}
	var NTF_Phi = Math.abs(NTF_Phi);
	var Deg_Lat_NTF = Math.floor(NTF_Phi);
	var Min_Lat_NTF = Math.floor((NTF_Phi - Deg_Lat_NTF) * 60);
	var Sec_Lat_NTF = Math.round(((NTF_Phi - Deg_Lat_NTF - Min_Lat_NTF / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_G.value = Deg_Lat_NTF
	form.T_Lat_Min_G.value = Min_Lat_NTF
	form.T_Lat_Sec_G.value = Sec_Lat_NTF
	if (N_S_Lat_NTF == "N")
		{
		form.selectNS2.selectedIndex = 0
		}
	if (N_S_Lat_NTF == "S")
		{
		form.selectNS2.selectedIndex = 1
		}
	form.T_Long_Deg_G.value = Deg_Long_NTF
	form.T_Long_Min_G.value = Min_Long_NTF
	form.T_Long_Sec_G.value = Sec_Long_NTF
	if (E_W_Long_NTF == "E")
		{
		form.selectEW2.selectedIndex = 0
		}
	if (E_W_Long_NTF == "W")
		{
		form.selectEW2.selectedIndex = 1
		}
     
	// affichage du facteur d'erreur
	//alert("Altération linéaire en cm par km : " + Lamb_kr);
	
/* Fin de la fonction Lambert II étendu (NTF) métrique - Clarke 1880 (1) -- VERS -- (NTF) - Clarke 1880 (1) */	
/* Module perfectible en ajoutant des boutons radio désignant les zones et en fonction des zones faire les constantes */
	}

function WGS_ED50(form)
/* De GPS (WGS84) - Iagrs80 (2) -- VERS -- ED50 Sexa - Hayford 1909 (3)*/
	{
	/* Constantes Ellipsoïde Hayford PRIAM ED50 */
	var ED50_a = 6378388.00;
	var ED50_f = 297;
	var ED50_b = ED50_a - (ED50_a / ED50_f);
	// la valeur e est en fait e au carré
	var ED50_e = (Math.pow(ED50_a,2) - Math.pow(ED50_b,2)) / Math.pow(ED50_a,2);

	/* Constantes Ellipsoïde Iagrs reporté GPS WGS84 */
	var WGS_a = 6378137;
	// La valeur f d origine Iagrs est 298.2572221010
	var WGS_f = 298.257223563;
	var WGS_b = WGS_a - (WGS_a / WGS_f);
	// la valeur e est en fait e au carré
	var WGS_e = (Math.pow(WGS_a,2) - Math.pow(WGS_b,2)) / Math.pow(WGS_a,2);

	/* Constantes Tx, Ty, Tz en mètres de Transformation de 3 vers 2 */
	var Tx = 84;
	var Ty = 97;
	var Tz = 117;

	/* Coordonnées LONGITUDE WGS84 Saisies (Si W -> -1 ou Si E -> 1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* Test du menu déroulant E ou W générant 1 ou -1 LONG */
	var ChoixEW = form.selectEW3.selectedIndex;
	if(ChoixEW == 0)
		{
		var WGS_Long_Signe = 1;
		}
	if(ChoixEW == 1)
		{
		var WGS_Long_Signe = -1;
		}
	/* Mise en Float des variables lues pour éviter les erreurs NaN (Not a Number) */
	var WGS_Long_Sgn = parseFloat(WGS_Long_Signe);
	var WGS_Long_Deg = parseFloat(form.T_Long_Deg_W.value);
	var WGS_Long_Min = parseFloat(form.T_Long_Min_W.value);
	var WGS_Long_Sec = parseFloat(form.T_Long_Sec_W.value);

	/* Coordonnées LONGITUDE WGS84 (Lambda) Décimale calculée */
	var WGS_Long_Dec = WGS_Long_Sgn * ((WGS_Long_Deg) + (WGS_Long_Min / 60) + (WGS_Long_Sec / 3600));

	/* Coordonnées LATITUDE WGS84 Saisies (Si N -> 1 ou Si S -> -1) Pri_Deg, Pri_Min, Pri_Sec (virgules autorisées) */
	/* var Pri_Lat_Signe = Test du menu déroulant N ou S générant 1 ou -1 Normalement Nord sinon Pas de Lambert ! */
	var ChoixNS = form.selectNS3.selectedIndex;
	if(ChoixNS == 0)
		{
		var WGS_Lat_Signe = 1;
		}
	if(ChoixNS == 1)
		{
		var WGS_Lat_Signe = -1;
		}
	/* Mise en Float les variables lues pour éviter les erreurs NaN (Not a Number) */
	var WGS_Lat_Sgn = parseFloat(WGS_Lat_Signe);
	var WGS_Lat_Deg = parseFloat(form.T_Lat_Deg_W.value);
	var WGS_Lat_Min = parseFloat(form.T_Lat_Min_W.value);
	var WGS_Lat_Sec = parseFloat(form.T_Lat_Sec_W.value);

	/* Coordonnées LATITUDE Priam (Phi) Décimale calculée */
	var WGS_Lat_Dec = WGS_Lat_Sgn * ((WGS_Lat_Deg) + (WGS_Lat_Min / 60) + (WGS_Lat_Sec / 3600));

	/* Pas de considération de hauteur (en mètres) mis à 0 -- Peut être perfectible en ajoutant les tables de hauteur */
	var Hauteur = 0;

	/* Référence Méridien de Grennwich pas décalage d'un système à l'autre (n'affecte que le goide de Clarke) */

     /* Partie - coordonnées géocentriques sur l'ellipsoïde Origine */
	/* Variable v (en mètres) calculée */
	var WGS_v = WGS_a / (Math.sqrt(1 - (WGS_e * Math.pow(Math.sin(WGS_Lat_Dec * (Math.PI / 180)),2))));

	/* Variable X calculée en mètres */
	var WGS_X = (WGS_v + Hauteur) * Math.cos(WGS_Lat_Dec * (Math.PI / 180)) * Math.cos(WGS_Long_Dec * (Math.PI / 180));

	/* Variable Y calculée en mètres Y = (v+h).Cos(Phi).Sin(Lambda) (H_Y comme Hayford Z) */
	var WGS_Y = (WGS_v + Hauteur) * Math.cos(WGS_Lat_Dec * (Math.PI / 180)) * Math.sin(WGS_Long_Dec * (Math.PI / 180));

	/* Variable Z calculée en mètres Z = (v*(1-e)+h).Sin(Phi) (H_Z comme Hayford Z) */
	var WGS_Z = (WGS_v * (1 - WGS_e) + Hauteur) * Math.sin(WGS_Lat_Dec * (Math.PI / 180));

     /* Partie - coordonnées géocentriques sur l'ellipsoïde Destination */
	/* Décalage longitude Paris Greenwich (2° 20' 14.025"") - Valeur en Degrés décimaux */
	var Paris_Green = 2 + (20 / 60) + (14.025 / 3600);
	/* Dans ce cas aucune différence - même référence = Greenwich nommé Lambda_0 */
	var Lambda_0 = 0;

	/* Variable X' calculée en mètres */
	var ED50_X = Tx + WGS_X * Math.cos(Lambda_0 * (Math.PI / 180)) + WGS_Y * Math.sin(Lambda_0 * (Math.PI / 180));

	/* Variable Y' calculée en mètres */
	var ED50_Y = Ty - WGS_X * Math.sin(Lambda_0 * (Math.PI / 180)) + WGS_Y * Math.cos(Lambda_0 * (Math.PI / 180));

	/* Variable Z' calculée en mètres */
	var ED50_Z = WGS_Z + Tz;

	/* Variable Re_1 calculée en mètres Re_1 = RACINE (X'^2 + Y'^2) Re_1 Car autre formule de calcul donne meme résultat */
	var Re_1 = Math.sqrt(Math.pow(ED50_X,2) + (Math.pow(ED50_Y,2)));

     /* Partie Coordonnées géographiques sur l'ellipsoïde de destination Origine Greenwich */
	/* Longitude Lambda en degrés décimaux sur Hayford */
	var Long_ED50_Dec = Math.atan(ED50_Y / ED50_X) / (Math.PI / 180);

	/* Latitude Phi en degrés décimaux sur Iagrs */
	var ecart = 1;
	var Phi = WGS_Lat_Dec / (180 * Math.PI);
	while (ecart > 0.0000000001)
		{
		Phi_1 = Math.atan((ED50_Z + ED50_e * Math.sin(Phi) * ED50_a / Math.sqrt(1 - ED50_e * Math.pow(Math.sin(Phi),2))) / Re_1);
		ecart = Math.abs(Phi - Phi_1);
		Phi = Phi_1;
		}
	var Lat_ED50_Dec = Phi * (180 / Math.PI);

	/* Variable v en mètre sur Geoïde de destination - I_v = Iagrs_a / (racine (1 - Iagrs_e * (sin(Phi * 180/PI)^2) */
	var ED50_v = ED50_a / (Math.sqrt(1 - (ED50_e * Math.pow(Math.sin(Lat_ED50_Dec * (Math.PI / 180)),2))));

	/* Hauteur ellipsoïdale h_I en mètres - Résultat à corriger pour passer à des altitudes NGF au dessus de l'éllipsoïde */
	/* Formule = Re / Cos(Phi) - v */
	var h_ED50 = Re_1 / Math.cos(Lat_ED50_Dec*(Math.PI / 180)) - ED50_v;

     /* Tranformation Degrés décimaux Longitude arrivée en degré minute seconde avec reconnaissance E W */
	if (Long_ED50_Dec > 0)
		{
		var E_W_Long_ED50 = "E";
		}
	else
		{
		var E_W_Long_ED50 = "W";
		}
	Long_ED50_Dec = Math.abs(Long_ED50_Dec);
	var Deg_Long_ED50 = Math.abs(Math.floor(Long_ED50_Dec));
	var Min_Long_ED50 = Math.floor((Long_ED50_Dec - Deg_Long_ED50) * 60);
	var Sec_Long_ED50 = Math.round(((Long_ED50_Dec - Deg_Long_ED50 - Min_Long_ED50 / 60) * 3600)*1000)/1000;
	
     /* Tranformation Degrés décimaux Latitude arrivée en degré minute seconde avec reconnaissance N S */
	if (Lat_ED50_Dec > 0)
		{
		var N_S_Lat_ED50 = "N";
		}
	else
		{
		var N_S_Lat_ED50 = "S";
		}
	Lat_ED50_Dec = Math.abs(Lat_ED50_Dec);
	var Deg_Lat_ED50 = Math.floor(Lat_ED50_Dec);
	var Min_Lat_ED50 = Math.floor((Lat_ED50_Dec - Deg_Lat_ED50) * 60);
	var Sec_Lat_ED50 = Math.round(((Lat_ED50_Dec - Deg_Lat_ED50 - Min_Lat_ED50 / 60) * 3600)*1000)/1000;

	/* Affichage du résultat d'un form.nom du champ texte la form.value */
	form.T_Lat_Deg_P.value = Deg_Lat_ED50
	form.T_Lat_Min_P.value = Min_Lat_ED50
	form.T_Lat_Sec_P.value = Sec_Lat_ED50
	if (N_S_Lat_ED50 == "N")
		{
		form.selectNS1.selectedIndex = 0
		}
	if (N_S_Lat_ED50 == "S")
		{
		form.selectNS1.selectedIndex = 1
		}
	form.T_Long_Deg_P.value = Deg_Long_ED50
	form.T_Long_Min_P.value = Min_Long_ED50
	form.T_Long_Sec_P.value = Sec_Long_ED50
	if (E_W_Long_ED50 == "E")
		{
		form.selectEW1.selectedIndex = 0
		}
	if (E_W_Long_ED50 == "W")
		{
		form.selectEW1.selectedIndex = 1
		}
     
/* Fin de la fonction De GPS (WGS84) Sexa - Iagrs80 (2) -- VERS --  PRIAM (ED50) - Hayford 1909 (3) */
	}
