// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Did {

    uint public imageCount=0;
    Certificate[] public certificate;
    Image[] public images;
    Profile[] public profile;
    ApproveList[] public approveList;

    struct Profile{
        string name;
        string email;
        string content;
    }

    // This is a comment!
    struct Certificate {
        string name;
        string content;
        string issueDate;
        bool isApproved;
        address approvedBy;
        address requiredApprover;
    }

    struct ApproveList{
        address applyer;
        bool isApproved;
    }
    
    struct Image {
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
        
    }


    mapping(address => Profile) public profileMap;
    mapping(uint => Image) public imageMap;
    mapping (address => mapping (uint => Image)) public imageMapping; 
    mapping (address => mapping (uint => Certificate)) public certificateMap;
    mapping (address => uint256) public certificateCount;
    mapping (address => string) public DidName;
    mapping (address => ApproveList[]) public approveListMap;

   
  
    
    
    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author,
        uint commentCount 
    );

    event ImageTipped(
        uint id,
        string hash,
        string description,
        uint tipAmount
    );




    function getImageCount() public view returns (uint) {
        return imageCount;
    }

    function getUserProfile(address _address) public view returns (string memory, string memory, string memory) {
        return (profileMap[_address].name, profileMap[_address].email, profileMap[_address].content);
    }

    function getUserCertificate(address _address) public view returns (Certificate[] memory) {
        // Certificate[] memory certificates;
        // for (uint i = 0; i < certificateCount[_address]; i++) {
        //     certificates[i] = certificateMap[_address][i];
        // }    
        // return certificates;
        //prevent the revert error
        Certificate[] memory certificates = new Certificate[](certificateCount[_address]);
        for (uint i = 0; i < certificateCount[_address]; i++) {
            certificates[i] = certificateMap[_address][i];
        }
        return certificates;
    }


    function uploadImage(string memory _imgHash, string memory _description) public {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);
        // Make sure image description exists
        require(bytes(_description).length > 0);
        // Make sure uploader address exists
        require(msg.sender!=address(0));
        

        
        
        Image storage image = imageMap[imageCount];
        image.id = imageCount;
        image.hash = _imgHash;
        image.description = _description;
        image.tipAmount = 0;
        image.author = payable(msg.sender);

        imageCount++;
        
    }

    function tipImageOwner(uint _id, uint amount) public payable {
        // Fetch the image
        Image storage _image = imageMap[ _id];     
        _image.tipAmount += amount;
        // Trigger an event
        emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount);   
    }



    function store(string memory _name, string memory _email, string memory _content) public {
        //store the data in the profile
        profileMap[msg.sender] = Profile(_name, _email, _content);
        DidName[msg.sender] = _name;

    }
    
    function retrieve() public view returns (string memory  ,string memory  ,string memory ){

        return (profileMap[msg.sender].name, profileMap[msg.sender].email, profileMap[msg.sender].content);
    }


    function getCertificateCount() public view returns (uint256) {
        return certificateCount[msg.sender];
    }


    function addCertificate(string memory _name, string memory _content, string memory _issueDate, address _approver) public {
        certificateMap[msg.sender][certificateCount[msg.sender]] = Certificate(_name, _content, _issueDate, false,address(0),_approver);
        certificateCount[msg.sender]++; 
        //add the certificate to the specific approver's approveList
        approveListMap[_approver].push(ApproveList(msg.sender, false));
    }

    //approve certificate of a specific index and address
    function approveCertificate(address _address, uint256 _index) public {
        certificateMap[_address][_index].isApproved = true;
        certificateMap[_address][_index].approvedBy = msg.sender;

        //change the approveList of the msg.sender to true
        for (uint i = 0; i < approveListMap[msg.sender].length; i++) {
            if (approveListMap[msg.sender][i].applyer == _address) {
                approveListMap[msg.sender][i].isApproved = true;
            }
        }

    }

    function approveListMapping(address _address) public view returns (ApproveList[] memory) {
        return approveListMap[_address];
    }

    
}

