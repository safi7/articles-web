
var url = "http://ec2-54-179-166-196.ap-southeast-1.compute.amazonaws.com/api/articles";

$(function () {
  onFetch();
});

function onFetch() {
  // console.log('fetching ...');
  var search_field = document.getElementById("search-input");
  var pagination_field = document.getElementById("pagination");
  let page = pagination_field.value.split('Page ').length ? +pagination_field.value.split('Page ')[1] : 1;
  const params = `page=${page}&per_page=100&search=${search_field.value || null}`;
  fetch(`${url}?${params}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(({ data }) => {
      var rows = [];
      for (let each of data.data) {
        rows.push(appendRow(each));
      }

      var old_tbody = document.getElementById("art-tb-bd");
      var new_tbody = document.createElement('tbody');

      for (let row of rows) {
        new_tbody.appendChild(row);
      }

      new_tbody.id = 'art-tb-bd';
      old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
      createPagination(data.paginate);
    }).catch(error => {
      console.log('error', error);
      alert("Failed to fetch.");
    });
}


function appendRow(each) {
  var row = document.createElement("tr");

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var link = document.createElement('a');

  td1.className = 'company-name';
  td2.className = 'title';
  td3.className = 'url';
  td4.className = 'date';

  td1.appendChild(document.createTextNode(each.company_name));
  td2.appendChild(document.createTextNode(each.title));
  link.appendChild(document.createTextNode(each.url.split('ann_id=')[1]));
  link.setAttribute('href', each.url);
  link.setAttribute('target', each.url.split('ann_id=')[1]);
  td3.appendChild(link);
  td4.appendChild(document.createTextNode(each.publish_at));

  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);
  row.appendChild(td4);

  return row;
}

function createPagination(pagination) {
  let { page: selected_page, per_page, total } = pagination;

  var old_select = document.getElementById("pagination");
  var new_select = document.createElement('select');
  let pages = Math.ceil(total / per_page)

  for (let page = 1; page <= pages; page++) {
    var option = document.createElement('option');
    option.id = `${page}`;
    option.value = `Page ${page}`;
    option.innerHTML = `Page ${page}`;
    new_select.appendChild(option);
    if (page === selected_page) {
      new_select.value = `Page ${page}`;;
    }
  }

  new_select.id = 'pagination';
  new_select.setAttribute('onchange', 'onFetch()');
  old_select.parentNode.replaceChild(new_select, old_select)
}
