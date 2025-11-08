import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { UserIcon, GlobeIcon, BookIcon, DollarSignIcon, ChevronDownIcon, AcademicCapIcon } from './icons';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const countries = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Åland Islands', code: 'AX' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Bouvet Island', code: 'BV' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Indian Ocean Territory', code: 'IO' },
    { name: 'Brunei Darussalam', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cape Verde', code: 'CV' },
    { name: 'Cayman Islands', code: 'KY' },
    { name: 'Central African Republic', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Christmas Island', code: 'CX' },
    { name: 'Cocos (Keeling) Islands', code: 'CC' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros', code: 'KM' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo, The Democratic Republic of the', code: 'CD' },
    { name: 'Cook Islands', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Cote D\'Ivoire', code: 'CI' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czech Republic', code: 'CZ' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Falkland Islands (Malvinas)', code: 'FK' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'French Southern Territories', code: 'TF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
    { name: 'Holy See (Vatican City State)', code: 'VA' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran, Islamic Republic Of', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Isle of Man', code: 'IM' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
    { name: 'Korea, Republic of', code: 'KR' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: 'Lao People\'S Democratic Republic', code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libyan Arab Jamahiriya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macao', code: 'MO' },
    { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mayotte', code: 'YT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia, Federated States of', code: 'FM' },
    { name: 'Moldova, Republic of', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montserrat', code: 'MS' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Netherlands Antilles', code: 'AN' },
    { name: 'New Caledonia', code: 'NC' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Niue', code: 'NU' },
    { name: 'Norfolk Island', code: 'NF' },
    { name: 'Northern Mariana Islands', code: 'MP' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Palestinian Territory, Occupied', code: 'PS' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Pitcairn', code: 'PN' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Puerto Rico', code: 'PR' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Reunion', code: 'RE' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russian Federation', code: 'RU'},
    { name: 'Rwanda', code: 'RW'},
    { name: 'Saint Helena', code: 'SH'},
    { name: 'Saint Kitts and Nevis', code: 'KN'},
    { name: 'Saint Lucia', code: 'LC'},
    { name: 'Saint Pierre and Miquelon', code: 'PM'},
    { name: 'Saint Vincent and the Grenadines', code: 'VC'},
    { name: 'Samoa', code: 'WS'},
    { name: 'San Marino', code: 'SM'},
    { name: 'Sao Tome and Principe', code: 'ST'},
    { name: 'Saudi Arabia', code: 'SA'},
    { name: 'Senegal', code: 'SN'},
    { name: 'Serbia and Montenegro', code: 'CS'},
    { name: 'Seychelles', code: 'SC'},
    { name: 'Sierra Leone', code: 'SL'},
    { name: 'Singapore', code: 'SG'},
    { name: 'Slovakia', code: 'SK'},
    { name: 'Slovenia', code: 'SI'},
    { name: 'Solomon Islands', code: 'SB'},
    { name: 'Somalia', code: 'SO'},
    { name: 'South Africa', code: 'ZA'},
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
    { name: 'Spain', code: 'ES'},
    { name: 'Sri Lanka', code: 'LK'},
    { name: 'Sudan', code: 'SD'},
    { name: 'Suriname', code: 'SR'},
    { name: 'Svalbard and Jan Mayen', code: 'SJ'},
    { name: 'Swaziland', code: 'SZ'},
    { name: 'Sweden', code: 'SE'},
    { name: 'Switzerland', code: 'CH'},
    { name: 'Syrian Arab Republic', code: 'SY'},
    { name: 'Taiwan, Province of China', code: 'TW'},
    { name: 'Tanzania, United Republic of', code: 'TZ'},
    { name: 'Thailand', code: 'TH'},
    { name: 'Timor-Leste', code: 'TL'},
    { name: 'Togo', code: 'TG'},
    { name: 'Tokelau', code: 'TK'},
    { name: 'Tonga', code: 'TO'},
    { name: 'Trinidad and Tobago', code: 'TT'},
    { name: 'Tunisia', code: 'TN'},
    { name: 'Turkey', code: 'TR'},
    { name: 'Turkmenistan', code: 'TM'},
    { name: 'Turks and Caicos Islands', code: 'TC'},
    { name: 'Tuvalu', code: 'TV'},
    { name: 'Uganda', code: 'UG'},
    { name: 'Ukraine', code: 'UA'},
    { name: 'United Arab Emirates', code: 'AE'},
    { name: 'United Kingdom', code: 'GB'},
    { name: 'United States', code: 'US'},
    { name: 'United States Minor Outlying Islands', code: 'UM'},
    { name: 'Uruguay', code: 'UY'},
    { name: 'Uzbekistan', code: 'UZ'},
    { name: 'Vanuatu', code: 'VU'},
    { name: 'Venezuela', code: 'VE'},
    { name: 'Viet Nam', code: 'VN'},
    { name: 'Virgin Islands, British', code: 'VG'},
    { name: 'Virgin Islands, U.S.', code: 'VI'},
    { name: 'Wallis and Futuna', code: 'WF'},
    { name: 'Western Sahara', code: 'EH'},
    { name: 'Yemen', code: 'YE'},
    { name: 'Zambia', code: 'ZM'},
    { name: 'Zimbabwe', code: 'ZW'}
];

const currencies = [
  { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' }, { code: 'JPY', name: 'Japanese Yen' }, { code: 'GBP', name: 'British Pound' }, { code: 'AUD', name: 'Australian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' }, { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' }, { code: 'INR', name: 'Indian Rupee' }, { code: 'BRL', name: 'Brazilian Real' }, { code: 'RUB', name: 'Russian Ruble' }, { code: 'ZAR', name: 'South African Rand' },
  { code: 'AFN', name: 'Afghan Afghani' }, { code: 'ALL', name: 'Albanian Lek' }, { code: 'DZD', name: 'Algerian Dinar' }, { code: 'AOA', name: 'Angolan Kwanza' }, { code: 'ARS', name: 'Argentine Peso' }, { code: 'AMD', name: 'Armenian Dram' }, { code: 'AWG', name: 'Aruban Florin' }, { code: 'AZN', name: 'Azerbaijani Manat' }, { code: 'BSD', name: 'Bahamian Dollar' }, { code: 'BHD', name: 'Bahraini Dinar' }, { code: 'BDT', name: 'Bangladeshi Taka' }, { code: 'BBD', name: 'Barbadian Dollar' }, { code: 'BYN', name: 'Belarusian Ruble' }, { code: 'BZD', name: 'Belize Dollar' }, { code: 'BMD', name: 'Bermudan Dollar' }, { code: 'BTN', name: 'Bhutanese Ngultrum' }, { code: 'BOB', name: 'Bolivian Boliviano' }, { code: 'BAM', name: 'Bosnia-Herzegovina Mark' }, { code: 'BWP', name: 'Botswanan Pula' }, { code: 'BGN', name: 'Bulgarian Lev' }, { code: 'BIF', name: 'Burundian Franc' }, { code: 'KHR', name: 'Cambodian Riel' }, { code: 'CVE', name: 'Cape Verdean Escudo' }, { code: 'KYD', name: 'Cayman Islands Dollar' }, { code: 'XAF', name: 'CFA Franc BEAC' }, { code: 'XOF', name: 'CFA Franc BCEAO' }, { code: 'CLP', name: 'Chilean Peso' }, { code: 'COP', name: 'Colombian Peso' }, { code: 'KMF', name: 'Comorian Franc' }, { code: 'CDF', name: 'Congolese Franc' }, { code: 'CRC', name: 'Costa Rican Colón' }, { code: 'HRK', name: 'Croatian Kuna' }, { code: 'CUP', name: 'Cuban Peso' }, { code: 'CZK', name: 'Czech Koruna' }, { code: 'DKK', name: 'Danish Krone' }, { code: 'DJF', name: 'Djiboutian Franc' }, { code: 'DOP', name: 'Dominican Peso' }, { code: 'XCD', name: 'East Caribbean Dollar' }, { code: 'EGP', name: 'Egyptian Pound' }, { code: 'ERN', name: 'Eritrean Nakfa' }, { code: 'ETB', name: 'Ethiopian Birr' }, { code: 'FKP', name: 'Falkland Islands Pound' }, { code: 'FJD', name: 'Fijian Dollar' }, { code: 'GMD', name: 'Gambian Dalasi' }, { code: 'GEL', name: 'Georgian Lari' }, { code: 'GHS', name: 'Ghanaian Cedi' }, { code: 'GIP', name: 'Gibraltar Pound' }, { code: 'GTQ', name: 'Guatemalan Quetzal' }, { code: 'GGP', name: 'Guernsey Pound' }, { code: 'GNF', name: 'Guinean Franc' }, { code: 'GYD', name: 'Guyanaese Dollar' }, { code: 'HTG', name: 'Haitian Gourde' }, { code: 'HNL', name: 'Honduran Lempira' }, { code: 'HKD', name: 'Hong Kong Dollar' }, { code: 'HUF', name: 'Hungarian Forint' }, { code: 'ISK', name: 'Icelandic Króna' }, { code: 'IDR', name: 'Indonesian Rupiah' }, { code: 'IRR', name: 'Iranian Rial' }, { code: 'IQD', name: 'Iraqi Dinar' }, { code: 'IMP', name: 'Manx pound' }, { code: 'ILS', name: 'Israeli New Shekel' }, { code: 'JMD', name: 'Jamaican Dollar' }, { code: 'JEP', name: 'Jersey Pound' }, { code: 'JOD', name: 'Jordanian Dinar' }, { code: 'KZT', name: 'Kazakhstani Tenge' }, { code: 'KES', name: 'Kenyan Shilling' }, { code: 'KWD', name: 'Kuwaiti Dinar' }, { code: 'KGS', name: 'Kyrgystani Som' }, { code: 'LAK', name: 'Laotian Kip' }, { code: 'LBP', name: 'Lebanese Pound' }, { code: 'LSL', name: 'Lesotho Loti' }, { code: 'LRD', name: 'Liberian Dollar' }, { code: 'LYD', name: 'Libyan Dinar' }, { code: 'MOP', name: 'Macanese Pataca' }, { code: 'MKD', name: 'Macedonian Denar' }, { code: 'MGA', name: 'Malagasy Ariary' }, { code: 'MWK', name: 'Malawian Kwacha' }, { code: 'MYR', name: 'Malaysian Ringgit' }, { code: 'MVR', name: 'Maldivian Rufiyaa' }, { code: 'MRU', name: 'Mauritanian Ouguiya' }, { code: 'MUR', name: 'Mauritian Rupee' }, { code: 'MXN', name: 'Mexican Peso' }, { code: 'MDL', name: 'Moldovan Leu' }, { code: 'MNT', name: 'Mongolian Tugrik' }, { code: 'MAD', name: 'Moroccan Dirham' }, { code: 'MZN', name: 'Mozambican Metical' }, { code: 'MMK', name: 'Myanmar Kyat' }, { code: 'NAD', name: 'Namibian Dollar' }, { code: 'NPR', name: 'Nepalese Rupee' }, { code: 'ANG', name: 'Netherlands Antillean Guilder' }, { code: 'TWD', name: 'New Taiwan Dollar' }, { code: 'NZD', name: 'New Zealand Dollar' }, { code: 'NIO', name: 'Nicaraguan Córdoba' }, { code: 'NGN', name: 'Nigerian Naira' }, { code: 'KPW', name: 'North Korean Won' }, { code: 'NOK', name: 'Norwegian Krone' }, { code: 'OMR', name: 'Omani Rial' }, { code: 'PKR', name: 'Pakistani Rupee' }, { code: 'PAB', name: 'Panamanian Balboa' }, { code: 'PGK', name: 'Papua New Guinean Kina' }, { code: 'PYG', name: 'Paraguayan Guarani' }, { code: 'PEN', name: 'Peruvian Sol' }, { code: 'PHP', name: 'Philippine Peso' }, { code: 'PLN', name: 'Polish Zloty' }, { code: 'QAR', name: 'Qatari Rial' }, { code: 'RON', name: 'Romanian Leu' }, { code: 'RWF', name: 'Rwandan Franc' }, { code: 'SHP', name: 'Saint Helena Pound' }, { code: 'WST', name: 'Samoan Tala' }, { code: 'STN', name: 'São Tomé & Príncipe Dobra' }, { code: 'SAR', name: 'Saudi Riyal' }, { code: 'RSD', name: 'Serbian Dinar' }, { code: 'SCR', name: 'Seychellois Rupee' }, { code: 'SLL', name: 'Sierra Leonean Leone' }, { code: 'SGD', name: 'Singapore Dollar' }, { code: 'SBD', name: 'Solomon Islands Dollar' }, { code: 'SOS', name: 'Somali Shilling' }, { code: 'KRW', name: 'South Korean Won' }, { code: 'SSP', name: 'South Sudanese Pound' }, { code: 'LKR', name: 'Sri Lankan Rupee' }, { code: 'SDG', name: 'Sudanese Pound' }, { code: 'SRD', name: 'Surinamese Dollar' }, { code: 'SZL', name: 'Swazi Lilangeni' }, { code: 'SEK', name: 'Swedish Krona' }, { code: 'SYP', name: 'Syrian Pound' }, { code: 'TJS', name: 'Tajikistani Somoni' }, { code: 'TZS', name: 'Tanzanian Shilling' }, { code: 'THB', name: 'Thai Baht' }, { code: 'TOP', name: 'Tongan Paʻanga' }, { code: 'TTD', name: 'Trinidad & Tobago Dollar' }, { code: 'TND', name: 'Tunisian Dinar' }, { code: 'TRY', name: 'Turkish Lira' }, { code: 'TMT', name: 'Turkmenistani Manat' }, { code: 'UGX', name: 'Ugandan Shilling' }, { code: 'UAH', name: 'Ukrainian Hryvnia' }, { code: 'AED', name: 'United Arab Emirates Dirham' }, { code: 'UYU', name: 'Uruguayan Peso' }, { code: 'UZS', name: 'Uzbekistan Som' }, { code: 'VUV', name: 'Vanuatu Vatu' }, { code: 'VES', name: 'Venezuelan Bolívar' }, { code: 'VND', name: 'Vietnamese Dong' }, { code: 'YER', name: 'Yemeni Rial' }, { code: 'ZMW', name: 'Zambian Kwacha' },
];

const academicLevels = ['High School Diploma', 'Bachelors', 'Masters', 'PhD'];

const CountryTag: React.FC<{ name: string; onRemove: (name: string) => void }> = ({ name, onRemove }) => (
    <span className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">
        {name}
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onRemove(name);
            }}
            className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
            aria-label={`Remove ${name}`}
        >
            &times;
        </button>
    </span>
);

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    countryOfOrigin: 'United States',
    countryOfResidence: 'United States',
    studyCountries: [],
    major: '',
    currentCourse: '',
    academicLevel: 'Bachelors',
    budget: 50000,
    scholarshipInterest: false,
    currency: 'USD',
  });

  const [formattedBudget, setFormattedBudget] = useState<string>(formData.budget.toLocaleString());
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'budget') {
        const cleanValue = value.replace(/\D/g, ''); // Remove all non-digit characters
        const numericValue = parseInt(cleanValue, 10) || 0;
        setFormData(prev => ({ ...prev, budget: numericValue }));
        setFormattedBudget(cleanValue ? numericValue.toLocaleString() : '');
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCountrySelect = (countryName: string) => {
    setFormData(prev => {
        const newStudyCountries = prev.studyCountries.includes(countryName)
            ? prev.studyCountries.filter(c => c !== countryName)
            : [...prev.studyCountries, countryName];
        return { ...prev, studyCountries: newStudyCountries };
    });
    setCountrySearch('');
  };
  
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.studyCountries.length === 0) {
        alert("Please select at least one intended country of study.");
        return;
    }
    onSubmit(formData);
  };
  
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Your Profile</h2>
        <p className="text-gray-500 mt-2">Tell us about yourself to get personalized university recommendations.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Jane Doe" />
                    </div>
                </div>

                {/* Major */}
                <div>
                    <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">Preferred Course / Major</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <BookIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input type="text" name="major" id="major" value={formData.major} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Computer Science" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country of Origin */}
                <div>
                    <label htmlFor="countryOfOrigin" className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><GlobeIcon className="h-5 w-5 text-gray-400" /></span>
                        <select id="countryOfOrigin" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                            {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><ChevronDownIcon className="h-5 w-5 text-gray-400" /></span>
                    </div>
                </div>
                {/* Country of Residence */}
                <div>
                    <label htmlFor="countryOfResidence" className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><GlobeIcon className="h-5 w-5 text-gray-400" /></span>
                        <select id="countryOfResidence" name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                            {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><ChevronDownIcon className="h-5 w-5 text-gray-400" /></span>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1">
                {/* Intended Country of Study */}
                <div>
                    <label htmlFor="studyCountries" className="block text-sm font-medium text-gray-700 mb-1">Intended Countries of Study</label>
                    <div className="relative" ref={countryDropdownRef}>
                        <div 
                            onClick={() => setCountryDropdownOpen(prev => !prev)}
                            className="flex flex-wrap items-center w-full p-1 border border-gray-300 rounded-md shadow-sm bg-white cursor-text min-h-[42px]"
                        >
                            <span className="absolute top-2.5 left-0 flex items-center pl-3 pointer-events-none">
                                <GlobeIcon className="h-5 w-5 text-gray-400" />
                            </span>
                            <div className="pl-7 flex flex-wrap flex-grow">
                                {formData.studyCountries.map(country => (
                                    <CountryTag key={country} name={country} onRemove={handleCountrySelect} />
                                ))}
                                <input
                                    type="text"
                                    value={countrySearch}
                                    onChange={(e) => {
                                      setCountrySearch(e.target.value)
                                      setCountryDropdownOpen(true);
                                    }}
                                    onFocus={() => setCountryDropdownOpen(true)}
                                    className="flex-grow p-1 border-none focus:ring-0 text-sm"
                                    placeholder={formData.studyCountries.length === 0 ? "Select one or more countries..." : ""}
                                />
                            </div>
                             <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><ChevronDownIcon className="h-5 w-5 text-gray-400" /></span>
                        </div>

                        {countryDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                <ul className="py-1" role="listbox">
                                    {filteredCountries.map(country => (
                                        <li 
                                            key={country.code} 
                                            onClick={() => handleCountrySelect(country.name)}
                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                            role="option"
                                            aria-selected={formData.studyCountries.includes(country.name)}
                                        >
                                           <input
                                                type="checkbox"
                                                checked={formData.studyCountries.includes(country.name)}
                                                readOnly
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 pointer-events-none"
                                           />
                                           {country.name}
                                        </li>
                                    ))}
                                    {filteredCountries.length === 0 && <li className="px-3 py-2 text-gray-500">No countries found</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Current Academic Course */}
                 <div>
                    <label htmlFor="currentCourse" className="block text-sm font-medium text-gray-700 mb-1">Current Academic Course</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <BookIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input type="text" name="currentCourse" id="currentCourse" value={formData.currentCourse} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. A-Levels in Science" />
                    </div>
                </div>
                {/* Academic Level */}
                <div>
                    <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 mb-1">Current/Highest Academic Level</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><AcademicCapIcon className="h-5 w-5 text-gray-400" /></span>
                        <select id="academicLevel" name="academicLevel" value={formData.academicLevel} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                            {academicLevels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                         <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><ChevronDownIcon className="h-5 w-5 text-gray-400" /></span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Budget */}
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Annual Budget (Tuition & Living)</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSignIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input type="text" name="budget" id="budget" value={formattedBudget} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="50,000" inputMode="numeric" />
                    </div>
                </div>

                {/* Currency */}
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                     <div className="relative">
                        <select id="currency" name="currency" value={formData.currency} onChange={handleChange} className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none">
                            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                        </select>
                         <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><ChevronDownIcon className="h-5 w-5 text-gray-400" /></span>
                    </div>
                </div>
            </div>
            
            {/* Scholarship Interest */}
            <div className="flex items-center">
                <input id="scholarshipInterest" name="scholarshipInterest" type="checkbox" checked={formData.scholarshipInterest} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="scholarshipInterest" className="ml-2 block text-sm text-gray-900">Interested in scholarships?</label>
            </div>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Get Recommendations
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;